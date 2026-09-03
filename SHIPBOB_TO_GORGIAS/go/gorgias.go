package main

import (
	"errors"
	"fmt"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var gorgiasLogger = newLogger("gorgias")

// emailRE mirrors the check the older integration used, so a recipient email
// found here is one Gorgias would actually accept.
var emailRE = regexp.MustCompile(`^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([\]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$`)

// isoRE captures the date/time portion of a ShipBob ISO timestamp, ignoring the
// fractional seconds and offset entirely.
var isoRE = regexp.MustCompile(`^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})`)

// formatDate renders a ShipBob ISO timestamp for the customer sidebar; passes
// through anything unparseable. Works on the raw string with a regex instead of
// parsing into a time.Time — ShipBob timestamps are UTC-only, so there is no
// timezone to convert, and this avoids a full parse for a display-only format.
func formatDate(value string) string {
	if value == "" {
		return ""
	}
	m := isoRE.FindStringSubmatch(value)
	if m == nil {
		return value
	}
	year, month, day, hour, minute, second := m[1], m[2], m[3], m[4], m[5], m[6]
	return fmt.Sprintf("%s/%s/%s %s:%s:%s UTC", day, month, year, hour, minute, second)
}

// GorgiasClient is what cron.go/webhook.go depend on for network calls —
// satisfied by *GorgiasAPI and, in tests, by a fake.
type GorgiasClient interface {
	FindCustomer(email, externalID string) (map[string]any, error) // nil, nil = not found
	CreateCustomer(payload map[string]any) (float64, error)
	UpdateCustomer(id float64, payload map[string]any) error
	CreateTicket(payload map[string]any) (map[string]any, error)
}

// GorgiasAPI is the Gorgias client.
//
// The cron flow upserts customers (writing ShipBob order history to
// data.pandium.shipbob_orders); the webhook flow creates tickets.
//
// Auth is OAuth2 via Pandium's gorgias-oauth connector. Pandium runs the
// authorization flow when the tenant connects and refreshes the token on its own
// schedule, so this client never sees a client secret, never posts to a token
// endpoint, and holds no refresh logic — it reads whatever access token is
// current for this run and sends it as a bearer token. A refresh that fails is a
// platform concern and surfaces as Failed (Refresh) on the run, not as an error
// this code has to handle.
type GorgiasAPI struct {
	apiURL string
	client *retryClient
}

func NewGorgiasAPI(pandium *Pandium) (*GorgiasAPI, error) {
	token := pandium.Secrets["gorgias_oauth_access_token"]
	account := pandium.Secrets["gorgias_oauth_account"]
	if token == "" || account == "" {
		return nil, errors.New("PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN and PAN_SEC_GORGIAS_OAUTH_ACCOUNT are required")
	}
	tokenType := pandium.Secrets["gorgias_oauth_token_type"]
	if tokenType == "" {
		tokenType = "Bearer"
	}
	apiURL := fmt.Sprintf("https://%s.gorgias.com/api", strings.ToLower(account))
	return &GorgiasAPI{
		apiURL: apiURL,
		// Exponential backoff: 2s, 4s, 8s, ... GET/POST/PUT are all retried.
		client: newRetryClient(apiURL, tokenType+" "+token, 2*time.Second, []string{"GET", "POST", "PUT"}),
	}, nil
}

// FindCustomer looks a customer up by email or externalID and returns the detail
// record (so callers can read data), or nil if not found. A given email/
// externalID maps to at most one customer, so no pagination is needed.
func (g *GorgiasAPI) FindCustomer(email, externalID string) (map[string]any, error) {
	gorgiasLogger.Info("looking for gorgias customer", "email", email, "external_id", externalID)
	var query string
	switch {
	case email != "":
		query = "email=" + url.QueryEscape(strings.ToLower(email))
	case externalID != "":
		query = "external_id=" + url.QueryEscape(externalID)
	default:
		return nil, nil
	}

	res, err := g.client.get("/customers?"+query, nil)
	if err != nil {
		return nil, err
	}
	body, _ := res.(map[string]any)
	rows, _ := body["data"].([]any)
	if len(rows) == 0 {
		gorgiasLogger.Info("Customer not found")
		return nil, nil
	}
	first, _ := rows[0].(map[string]any)
	id := formatID(first["id"])

	detail, err := g.client.get("/customers/"+id, nil)
	if err != nil {
		return nil, err
	}
	gorgiasLogger.Info("Customer found")
	customer, _ := detail.(map[string]any)
	return customer, nil
}

func (g *GorgiasAPI) CreateCustomer(payload map[string]any) (float64, error) {
	gorgiasLogger.Info("creating new gorgias customer")
	res, err := g.client.post("/customers", payload)
	if err != nil {
		gorgiasLogger.Error("create customer failed", "error", err)
		return 0, err
	}
	body, _ := res.(map[string]any)
	id, _ := body["id"].(float64)
	gorgiasLogger.Info("Customer created successfully")
	return id, nil
}

func (g *GorgiasAPI) UpdateCustomer(id float64, payload map[string]any) error {
	idStr := strconv.FormatFloat(id, 'f', -1, 64)
	gorgiasLogger.Info("updating gorgias customer", "customer_id", idStr)
	_, err := g.client.put("/customers/"+idStr, payload)
	if err != nil {
		gorgiasLogger.Error("update customer failed", "customer_id", idStr, "error", err)
		return err
	}
	gorgiasLogger.Info("customer updated")
	return nil
}

func (g *GorgiasAPI) CreateTicket(payload map[string]any) (map[string]any, error) {
	gorgiasLogger.Info("creating gorgias ticket")
	res, err := g.client.post("/tickets", payload)
	if err != nil {
		gorgiasLogger.Error("create ticket failed", "error", err)
		return nil, err
	}
	ticket, _ := res.(map[string]any)
	return ticket, nil
}

// ValidEmail returns email if Gorgias would accept it, else "".
func ValidEmail(email string) string {
	if email != "" && !strings.Contains(email, ".@") && emailRE.MatchString(email) {
		return email
	}
	return ""
}

// CustomerKey is the key identifying an order's customer: a valid recipient email
// when present, otherwise a synthetic "name address1 city country".
func CustomerKey(order map[string]any) string {
	email := ValidEmail(asString(deepGet(order, "recipient.email", "")))
	if email != "" {
		return email
	}
	address, _ := deepGet(order, "recipient.address", map[string]any{}).(map[string]any)
	parts := []string{
		asString(deepGet(order, "recipient.name", "")),
		asString(deepGet(address, "address1", "")),
		asString(deepGet(address, "city", "")),
		asString(deepGet(address, "country", "")),
	}
	return strings.Join(parts, " ")
}

// NewCustomerPayload is the body for POST /customers when the customer does not
// yet exist.
func NewCustomerPayload(order map[string]any, key string) map[string]any {
	payload := map[string]any{
		"name":        deepGet(order, "recipient.name", ""),
		"external_id": key,
		"data":        map[string]any{"pandium": map[string]any{"shipbob_orders": []any{}}},
	}
	if email := ValidEmail(asString(deepGet(order, "recipient.email", ""))); email != "" {
		payload["email"] = email
	}
	return payload
}

// OrderDataPayload is the single order entry stored in data.pandium.shipbob_orders.
func OrderDataPayload(order map[string]any) map[string]any {
	shipments, _ := deepGet(order, "shipments", []any{}).([]any)
	for _, item := range shipments {
		shipment, ok := item.(map[string]any)
		if !ok {
			continue
		}
		for _, field := range []string{"estimated_fulfillment_date", "actual_fulfillment_date"} {
			if v, ok := shipment[field].(string); ok && v != "" {
				shipment[field] = formatDate(v)
			}
		}
		shipment["url"] = fmt.Sprintf("https://web.shipbob.com/App/Merchant/#/Orders/%s/", formatID(shipment["id"]))
	}
	return map[string]any{
		"id":              deepGet(order, "id", ""),
		"created_date":    formatDate(asString(deepGet(order, "created_date", ""))),
		"purchase_date":   formatDate(asString(deepGet(order, "purchase_date", ""))),
		"reference_id":    deepGet(order, "reference_id", ""),
		"order_number":    deepGet(order, "order_number", ""),
		"status":          deepGet(order, "status", ""),
		"type":            deepGet(order, "type", ""),
		"channel":         deepGet(order, "channel", map[string]any{}),
		"shipping_method": deepGet(order, "shipping_method", ""),
		"recipient":       deepGet(order, "recipient", map[string]any{}),
		"products":        deepGet(order, "products", []any{}),
		"tags":            deepGet(order, "tags", []any{}),
		"shipments":       shipments,
	}
}

func asString(v any) string {
	s, _ := v.(string)
	return s
}
