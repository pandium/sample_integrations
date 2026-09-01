package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

// retryStatuses are the response codes worth retrying — matches every other
// language's port here (429, 502, 503, 504).
var retryStatuses = map[int]bool{429: true, 502: true, 503: true, 504: true}

// retryClient is a small HTTP client with exponential backoff retry, scoped to one
// API's base URL and auth header. doRequest is injectable so tests can stub the
// network without a full http.RoundTripper mock.
type retryClient struct {
	doRequest     func(*http.Request) (*http.Response, error)
	baseURL       string
	authorization string
	backoff       time.Duration
	retryMethods  map[string]bool
	maxAttempts   int
}

func newRetryClient(baseURL, authorization string, backoff time.Duration, retryMethods []string) *retryClient {
	methods := make(map[string]bool, len(retryMethods))
	for _, m := range retryMethods {
		methods[m] = true
	}
	httpClient := &http.Client{Timeout: 30 * time.Second}
	return &retryClient{
		doRequest:     httpClient.Do,
		baseURL:       baseURL,
		authorization: authorization,
		backoff:       backoff,
		retryMethods:  methods,
		maxAttempts:   6,
	}
}

func (c *retryClient) get(path string, query url.Values) (any, error) {
	full := c.baseURL + path
	if len(query) > 0 {
		full += "?" + query.Encode()
	}
	return c.send(http.MethodGet, full, nil)
}

func (c *retryClient) post(path string, body any) (any, error) {
	return c.send(http.MethodPost, c.baseURL+path, body)
}

func (c *retryClient) put(path string, body any) (any, error) {
	return c.send(http.MethodPut, c.baseURL+path, body)
}

// send performs one request, retrying on a network error or a retryable status
// code when the method is allowed to retry. Backoff is backoff * 2^(attempt-1)
// for attempts after the first, no jitter.
//
// A response with an empty body decodes to (nil, nil), not an error — that's what
// lets a caller distinguish "genuinely nothing here" from a real failure.
func (c *retryClient) send(method, fullURL string, body any) (any, error) {
	var bodyBytes []byte
	if body != nil {
		var err error
		bodyBytes, err = json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("could not encode request body: %w", err)
		}
	}

	var lastErr error
	for attempt := 1; attempt <= c.maxAttempts; attempt++ {
		if attempt > 1 {
			time.Sleep(c.backoff * time.Duration(1<<(attempt-2)))
		}

		req, err := http.NewRequest(method, fullURL, bytes.NewReader(bodyBytes))
		if err != nil {
			return nil, fmt.Errorf("could not build request: %w", err)
		}
		req.Header.Set("accept", "application/json")
		req.Header.Set("content-type", "application/json")
		req.Header.Set("Authorization", c.authorization)

		res, err := c.doRequest(req)
		if err != nil {
			lastErr = err
			if c.retryMethods[method] {
				continue
			}
			return nil, err
		}

		respBody, readErr := io.ReadAll(res.Body)
		res.Body.Close()
		if readErr != nil {
			return nil, fmt.Errorf("could not read response body: %w", readErr)
		}

		if res.StatusCode >= 400 {
			lastErr = fmt.Errorf("HTTP %d: %s", res.StatusCode, respBody)
			if retryStatuses[res.StatusCode] && c.retryMethods[method] {
				continue
			}
			return nil, lastErr
		}

		if len(bytes.TrimSpace(respBody)) == 0 {
			return nil, nil
		}
		var data any
		if err := json.Unmarshal(respBody, &data); err != nil {
			return nil, fmt.Errorf("could not decode response body: %w", err)
		}
		return data, nil
	}
	return nil, lastErr
}
