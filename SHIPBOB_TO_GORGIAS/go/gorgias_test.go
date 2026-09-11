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

func TestValidEmail_AcceptsBareAddressesAndRejectsEverythingElse(t *testing.T) {
	good := []string{"jane@example.com", "j.doe+test@sub.example.co.uk", "user@[192.168.0.1]"}
	for _, email := range good {
		if got := validEmail(email); got != email {
			t.Errorf("validEmail(%q) = %q, want %q", email, got, email)
		}
	}

	bad := []string{"", "not-an-email", "a.@example.com", "@example.com", "jane@",
		"Jane Doe <jane@example.com>", // a display name isn't a bare address
		`"quoted string"@example.com`, // net/mail strips the quotes on round-trip; known, accepted divergence from the old regex
	}
	for _, email := range bad {
		if got := validEmail(email); got != "" {
			t.Errorf("validEmail(%q) = %q, want \"\"", email, got)
		}
	}
}

func TestCustomerKey_EmailOrSynthetic(t *testing.T) {
	if got := customerKey(recipientFromOrder(makeOrder(1, "x", "jane@example.com"))); got != "jane@example.com" {
		t.Errorf("customerKey(with email) = %q, want %q", got, "jane@example.com")
	}
	if got := customerKey(recipientFromOrder(makeOrder(1, "x", ""))); got != "Buyer 1 Main St NY US" {
		t.Errorf("customerKey(no email) = %q, want %q", got, "Buyer 1 Main St NY US")
	}
}
