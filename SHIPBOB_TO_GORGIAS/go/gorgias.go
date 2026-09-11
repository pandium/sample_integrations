package main

import (
	"context"
	"errors"
	"fmt"
	"net/mail"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var gorgiasLogger = newLogger("gorgias")

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
	FindCustomer(ctx context.Context, email, externalID string) (map[string]any, error) // nil, nil = not found
	CreateCustomer(ctx context.Context, payload map[string]any) (float64, error)
	UpdateCustomer(ctx context.Context, id float64, payload map[string]any) error
	CreateTicket(ctx context.Context, payload map[string]any) (map[string]any, error)
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
func (g *GorgiasAPI) FindCustomer(ctx context.Context, email, externalID string) (map[string]any, error) {
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

	res, err := g.client.get(ctx, "/customers?"+query, nil)
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

	detail, err := g.client.get(ctx, "/customers/"+id, nil)
	if err != nil {
		return nil, err
	}
	gorgiasLogger.Info("Customer found")
	customer, _ := detail.(map[string]any)
	return customer, nil
}

func (g *GorgiasAPI) CreateCustomer(ctx context.Context, payload map[string]any) (float64, error) {
	gorgiasLogger.Info("creating new gorgias customer")
	res, err := g.client.post(ctx, "/customers", payload)
	if err != nil {
		gorgiasLogger.Error("create customer failed", "error", err)
		return 0, err
	}
	body, _ := res.(map[string]any)
	id, _ := body["id"].(float64)
	gorgiasLogger.Info("Customer created successfully")
	return id, nil
}

func (g *GorgiasAPI) UpdateCustomer(ctx context.Context, id float64, payload map[string]any) error {
	idStr := strconv.FormatFloat(id, 'f', -1, 64)
	gorgiasLogger.Info("updating gorgias customer", "customer_id", idStr)
	_, err := g.client.put(ctx, "/customers/"+idStr, payload)
	if err != nil {
		gorgiasLogger.Error("update customer failed", "customer_id", idStr, "error", err)
		return err
	}
	gorgiasLogger.Info("customer updated")
	return nil
}

func (g *GorgiasAPI) CreateTicket(ctx context.Context, payload map[string]any) (map[string]any, error) {
	gorgiasLogger.Info("creating gorgias ticket")
	res, err := g.client.post(ctx, "/tickets", payload)
	if err != nil {
		gorgiasLogger.Error("create ticket failed", "error", err)
		return nil, err
	}
	ticket, _ := res.(map[string]any)
	return ticket, nil
}

// validEmail returns email if Gorgias would accept it, else "".
// validEmail returns email if Gorgias would accept it, else "". Requiring the parsed
// address to equal the input rejects anything mail.ParseAddress accepts beyond a bare
// address, e.g. a display name like "Jane Doe <jane@example.com>".
func validEmail(email string) string {
	addr, err := mail.ParseAddress(email)
	if err != nil || addr.Address != email {
		return ""
	}
	return email
}

// recipient is the part of a ShipBob order or shipment event that identifies who
// it ships to.
type recipient struct {
	Name    string
	Email   string
	Address address
}

type address struct {
	Address1 string
	City     string
	Country  string
}

// recipientFromOrder pulls a recipient out of an order, which otherwise stays a
// map[string]any (see orderDataPayload).
func recipientFromOrder(order map[string]any) recipient {
	addr, _ := deepGet(order, "recipient.address", map[string]any{}).(map[string]any)
	return recipient{
		Name:  asString(deepGet(order, "recipient.name", "")),
		Email: asString(deepGet(order, "recipient.email", "")),
		Address: address{
			Address1: asString(deepGet(addr, "address1", "")),
			City:     asString(deepGet(addr, "city", "")),
			Country:  asString(deepGet(addr, "country", "")),
		},
	}
}

// customerKey is the key identifying a recipient's customer: a valid email when
// present, otherwise a synthetic "name address1 city country".
func customerKey(r recipient) string {
	if email := validEmail(r.Email); email != "" {
		return email
	}
	return strings.Join([]string{r.Name, r.Address.Address1, r.Address.City, r.Address.Country}, " ")
}

// newCustomerPayload is the body for POST /customers when the customer does not
// yet exist.
func newCustomerPayload(r recipient, key string) map[string]any {
	payload := map[string]any{
		"name":        r.Name,
		"external_id": key,
		"data":        map[string]any{"pandium": map[string]any{"shipbob_orders": []any{}}},
	}
	if email := validEmail(r.Email); email != "" {
		payload["email"] = email
	}
	return payload
}

// orderDataPayload is the single order entry stored in data.pandium.shipbob_orders.
func orderDataPayload(order map[string]any) map[string]any {
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
