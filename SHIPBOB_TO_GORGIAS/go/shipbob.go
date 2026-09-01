package main

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strings"
	"time"
)

var shipbobLogger = newLogger("shipbob")

// authURLToBaseURL maps ShipBob's token-issuer host to the matching API base URL.
// Anything unrecognized falls back to prod.
var authURLToBaseURL = map[string]string{
	"https://authstage.shipbob.com": "https://sandbox-api.shipbob.com/2026-01",
	"https://auth.shipbob.com":      "https://api.shipbob.com/2026-01",
}

const DefaultBaseURL = "https://api.shipbob.com/2026-01"

// resolveBaseURL decodes the JWT payload and maps its iss claim to an API base URL.
func resolveBaseURL(token string) string {
	fail := func(err error) string {
		shipbobLogger.Error(fmt.Sprintf("Could not resolve ShipBob base URL from token: %s", err))
		return DefaultBaseURL
	}

	parts := strings.Split(token, ".")
	if len(parts) < 2 {
		return fail(errors.New("malformed token"))
	}
	payload := parts[1]
	if pad := len(payload) % 4; pad != 0 {
		payload += strings.Repeat("=", 4-pad)
	}
	decoded, err := base64.URLEncoding.DecodeString(payload)
	if err != nil {
		return fail(err)
	}
	var claims map[string]any
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return fail(err)
	}
	iss, _ := claims["iss"].(string)
	if base, ok := authURLToBaseURL[iss]; ok {
		return base
	}
	return DefaultBaseURL
}

// ShipBobClient is what cron.go depends on — satisfied by *ShipBobAPI and, in
// tests, by a fake. Go has no monkey-patching, so this interface has to exist from
// the start.
type ShipBobClient interface {
	NewOrdersPage(startDate time.Time, page int) ([]map[string]any, error)
	UpdatedOrdersPage(startDate time.Time, page int) ([]map[string]any, error)
	UpdateDate(order map[string]any, startDate time.Time) time.Time
}

// ShipBobAPI reads orders for the cron sync.
//
// Auth is a single bearer token (PAN_SEC_SHIPBOB_ACCESS_TOKEN). The base URL is
// resolved from the token's issuer (iss) claim, so the same code targets prod,
// sandbox, or QA depending on which token the tenant connected.
type ShipBobAPI struct {
	apiURL string
	client *retryClient
}

func NewShipBobAPI(pandium *Pandium) (*ShipBobAPI, error) {
	token := pandium.Secrets["shipbob_access_token"]
	if token == "" {
		return nil, errors.New("PAN_SEC_SHIPBOB_ACCESS_TOKEN is required")
	}
	return &ShipBobAPI{
		apiURL: resolveBaseURL(token),
		// Exponential backoff: 3s, 6s, 12s, ... Only GET is ever called by this client.
		client: newRetryClient(resolveBaseURL(token), "Bearer "+token, 3*time.Second, []string{"GET"}),
	}, nil
}

// getOrders GETs one page of /order.
//
// Only an exhausted query answers with an empty slice.
// The caller stops paging there and commits its cursor, so a failure — or a
// 200 carrying something other than a list — returns an error instead.
func (s *ShipBobAPI) getOrders(params url.Values) ([]map[string]any, error) {
	data, err := s.client.get("/order", params)
	if err != nil {
		shipbobLogger.Error(fmt.Sprintf("ShipBob order fetch failed (%s): %s", params.Encode(), err))
		return nil, err
	}
	if data == nil {
		// a page past the end can come back with no body
		return nil, nil
	}
	list, ok := data.([]any)
	if !ok {
		return nil, fmt.Errorf("ShipBob answered /order (%s) with %v", params.Encode(), data)
	}
	orders := make([]map[string]any, 0, len(list))
	for _, item := range list {
		if order, ok := item.(map[string]any); ok {
			orders = append(orders, order)
		}
	}
	return orders, nil
}

// NewOrdersPage is one page of orders created since startDate, oldest first.
func (s *ShipBobAPI) NewOrdersPage(startDate time.Time, page int) ([]map[string]any, error) {
	params := url.Values{
		"StartDate": {startDate.UTC().Format(time.RFC3339)},
		"Page":      {fmt.Sprintf("%d", page)},
		"SortOrder": {"Oldest"},
	}
	return s.getOrders(params)
}

// UpdatedOrdersPage is one page of orders updated since startDate.
//
// ShipBob puts last_update_at on shipments, not orders, so we derive a per-order
// update timestamp and sort the page newest-first. Advancing the cursor to the
// oldest processed update keeps the sync conservative: a timed-out run never skips
// an update, at the cost of some reprocessing (which is harmless — customer writes
// are idempotent PUTs).
func (s *ShipBobAPI) UpdatedOrdersPage(startDate time.Time, page int) ([]map[string]any, error) {
	params := url.Values{
		"LastUpdateStartDate": {startDate.UTC().Format(time.RFC3339)},
		"Page":                {fmt.Sprintf("%d", page)},
	}
	orders, err := s.getOrders(params)
	if err != nil {
		return nil, err
	}
	keys := make([]time.Time, len(orders))
	for i, order := range orders {
		keys[i] = s.UpdateDate(order, startDate)
	}
	for i := 1; i < len(orders); i++ {
		for j := i; j > 0 && keys[j].After(keys[j-1]); j-- { // newest first
			keys[j], keys[j-1] = keys[j-1], keys[j]
			orders[j], orders[j-1] = orders[j-1], orders[j]
		}
	}
	return orders, nil
}

// UpdateDate is the oldest shipment last_update_at on order that still falls after
// startDate; defaults to now when none qualify.
func (s *ShipBobAPI) UpdateDate(order map[string]any, startDate time.Time) time.Time {
	updateDate := time.Now().UTC()
	shipments, _ := order["shipments"].([]any)
	for _, item := range shipments {
		shipment, ok := item.(map[string]any)
		if !ok {
			continue
		}
		ts, _ := shipment["last_update_at"].(string)
		if ts == "" {
			continue
		}
		parsed, ok := parseTimestamp(ts)
		if !ok {
			continue
		}
		if parsed.After(startDate) && parsed.Before(updateDate) {
			updateDate = parsed
		}
	}
	return updateDate
}
