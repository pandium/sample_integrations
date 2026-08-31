package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"testing"
	"time"
)

func token(iss string) string {
	payload, _ := json.Marshal(map[string]string{"iss": iss})
	encoded := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(payload)
	return "header." + encoded + ".sig"
}

func TestResolveBaseURL_FromTokenIssuer(t *testing.T) {
	cases := []struct {
		name string
		iss  string
		want string
	}{
		{"sandbox", "https://authstage.shipbob.com", "https://sandbox-api.shipbob.com/2026-01"},
		{"prod", "https://auth.shipbob.com", "https://api.shipbob.com/2026-01"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := resolveBaseURL(token(tc.iss)); got != tc.want {
				t.Errorf("resolveBaseURL() = %q, want %q", got, tc.want)
			}
		})
	}
	if got := resolveBaseURL("not-a-jwt"); got != DefaultBaseURL {
		t.Errorf("resolveBaseURL(malformed) = %q, want %q (default -> prod)", got, DefaultBaseURL)
	}
}

// stubResponse builds an *http.Response with the given status and JSON body ("" for none).
func stubResponse(status int, jsonBody string) *http.Response {
	return &http.Response{
		StatusCode: status,
		Body:       io.NopCloser(bytes.NewBufferString(jsonBody)),
	}
}

// TestGetOrders_RaisesInsteadOfReportingItselfEmpty is the critical-fix test: the
// cron loop stops on an empty page and commits its cursor there, so only an
// exhausted query may answer with one.
func TestGetOrders_RaisesInsteadOfReportingItselfEmpty(t *testing.T) {
	api, err := NewShipBobAPI(NewPandium(nil, map[string]string{"shipbob_access_token": token("https://auth.shipbob.com")}, nil))
	if err != nil {
		t.Fatal(err)
	}
	api.client.maxAttempts = 1 // this test is about raise-vs-empty, not retry timing
	start := time.Date(2026, 7, 1, 0, 0, 0, 0, time.UTC)

	// exhausted -> empty, no error
	api.client.doRequest = func(*http.Request) (*http.Response, error) { return stubResponse(200, "[]"), nil }
	orders, err := api.NewOrdersPage(start, 1)
	if err != nil || len(orders) != 0 {
		t.Errorf("exhausted page: got (%v, %v), want ([], nil)", orders, err)
	}

	// a failure, not an empty page
	api.client.doRequest = func(*http.Request) (*http.Response, error) { return stubResponse(503, ""), nil }
	if _, err := api.NewOrdersPage(start, 1); err == nil {
		t.Error("503 response: want an error, got nil")
	}

	// a 200 that is not a page of orders either
	api.client.doRequest = func(*http.Request) (*http.Response, error) {
		return stubResponse(200, `{"errors":["nope"]}`), nil
	}
	if _, err := api.NewOrdersPage(start, 1); err == nil {
		t.Error("malformed 200 body: want an error, got nil")
	}
}
