package main

import (
	"os"
	"path/filepath"
	"testing"
)

// withDotEnv writes contents to <dir>/.env, chdirs into dir for the duration of the test,
// and restores the working directory and any env vars the test touches on cleanup.
func withDotEnv(t *testing.T, contents string, keys ...string) {
	t.Helper()
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, ".env"), []byte(contents), 0o644); err != nil {
		t.Fatal(err)
	}

	wd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}

	for _, key := range keys {
		original, existed := os.LookupEnv(key)
		t.Cleanup(func() {
			if existed {
				os.Setenv(key, original)
			} else {
				os.Unsetenv(key)
			}
		})
		os.Unsetenv(key)
	}
	t.Cleanup(func() { os.Chdir(wd) })
}

func TestLoadDotEnv_SetsUnquotedAndQuotedValues(t *testing.T) {
	withDotEnv(t, "PAN_CFG_ORDER_START_DATE=2026-07-01\nPAN_SEC_GORGIAS_OAUTH_ACCOUNT=\"my-store\"\n",
		"PAN_CFG_ORDER_START_DATE", "PAN_SEC_GORGIAS_OAUTH_ACCOUNT")

	loadDotEnv()

	if got := os.Getenv("PAN_CFG_ORDER_START_DATE"); got != "2026-07-01" {
		t.Errorf("PAN_CFG_ORDER_START_DATE = %q, want 2026-07-01", got)
	}
	if got := os.Getenv("PAN_SEC_GORGIAS_OAUTH_ACCOUNT"); got != "my-store" {
		t.Errorf("PAN_SEC_GORGIAS_OAUTH_ACCOUNT = %q, want my-store", got)
	}
}

func TestLoadDotEnv_SkipsBlankLinesAndComments(t *testing.T) {
	withDotEnv(t, "# a comment\n\nPAN_CFG_NEWEST_ORDER_FIRST=true\n", "PAN_CFG_NEWEST_ORDER_FIRST")

	loadDotEnv()

	if got := os.Getenv("PAN_CFG_NEWEST_ORDER_FIRST"); got != "true" {
		t.Errorf("PAN_CFG_NEWEST_ORDER_FIRST = %q, want true", got)
	}
}

func TestLoadDotEnv_DoesNotOverrideAnAlreadySetVariable(t *testing.T) {
	withDotEnv(t, "PAN_CTX_RUN_MODE=webhook\n", "PAN_CTX_RUN_MODE")
	os.Setenv("PAN_CTX_RUN_MODE", "normal")

	loadDotEnv()

	if got := os.Getenv("PAN_CTX_RUN_MODE"); got != "normal" {
		t.Errorf("PAN_CTX_RUN_MODE = %q, want normal (real env must win over .env)", got)
	}
}

func TestLoadDotEnv_MissingFileIsNotAnError(t *testing.T) {
	dir := t.TempDir()
	wd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.Chdir(wd) })

	loadDotEnv() // must not panic or error when .env does not exist
}
