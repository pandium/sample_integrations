package main

import "testing"

func TestGorgiasAPI_BuildsBaseURLAndBearerHeader(t *testing.T) {
	api, err := NewGorgiasAPI(NewPandium(nil, gorgiasSecrets, nil))
	if err != nil {
		t.Fatal(err)
	}
	if api.apiURL != "https://acme.gorgias.com/api" {
		t.Errorf("apiURL = %q, want %q", api.apiURL, "https://acme.gorgias.com/api")
	}
	if api.client.authorization != "Bearer gorgias-token-123" {
		t.Errorf("authorization = %q, want %q", api.client.authorization, "Bearer gorgias-token-123")
	}
}

func TestCustomerKey_EmailOrSynthetic(t *testing.T) {
	if got := customerKey(makeOrder(1, "x", "jane@example.com")); got != "jane@example.com" {
		t.Errorf("customerKey(with email) = %q, want %q", got, "jane@example.com")
	}
	if got := customerKey(makeOrder(1, "x", "")); got != "Buyer 1 Main St NY US" {
		t.Errorf("customerKey(no email) = %q, want %q", got, "Buyer 1 Main St NY US")
	}
}
