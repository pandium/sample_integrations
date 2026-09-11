package main

import (
	"bufio"
	"os"
	"strings"
)

// loadDotEnv reads .env from the working directory, if there is one, and sets each key as
// an environment variable — the same mechanism Pandium uses in production, environment
// variables and nothing else, just sourced from a local file for development. A variable
// already set in the real environment is left alone, so a real Pandium run is never
// shadowed by a stray .env file. Missing file is not an error; a malformed line is skipped.
func loadDotEnv() {
	f, err := os.Open(".env")
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		if len(value) >= 2 {
			if (value[0] == '"' && value[len(value)-1] == '"') || (value[0] == '\'' && value[len(value)-1] == '\'') {
				value = value[1 : len(value)-1]
			}
		}
		if _, exists := os.LookupEnv(key); !exists {
			os.Setenv(key, value)
		}
	}
}
