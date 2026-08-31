package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

// lineHandler formats log lines as "[timestamp] [module] LEVEL: message". Logs go to
// stderr; stdout is reserved for the JSON metadata Pandium reads back.
type lineHandler struct {
	*slog.TextHandler
	module string
}

func (h *lineHandler) Handle(_ context.Context, r slog.Record) error {
	timestamp := r.Time.Format("2006-01-02 15:04:05")
	_, err := fmt.Fprintf(os.Stderr, "[%s] [%s] %s: %s\n", timestamp, h.module, r.Level, r.Message)
	return err
}

// newLogger returns a logger scoped to the calling file, named after it.
func newLogger(module string) *slog.Logger {
	return slog.New(&lineHandler{
		TextHandler: slog.NewTextHandler(os.Stderr, nil),
		module:      module,
	})
}

var logger = newLogger("lib")

// fromEnv collects environment variables starting with prefix, stripping the prefix and
// lower-casing the remaining key.
func fromEnv(prefix string) map[string]string {
	items := make(map[string]string)
	for _, e := range os.Environ() {
		pair := strings.SplitN(e, "=", 2)
		if key, ok := strings.CutPrefix(pair[0], prefix); ok {
			items[strings.ToLower(key)] = pair[1]
		}
	}
	return items
}

// deepGet is a safe nested lookup by dotted path, e.g. deepGet(order,
// "recipient.address.city", ""). Go has no free-form dict indexing the way a raw
// JSON value does in some other languages, so every level is checked explicitly.
func deepGet(data any, path string, def any) any {
	cur := data
	for _, part := range strings.Split(path, ".") {
		m, ok := cur.(map[string]any)
		if !ok {
			return def
		}
		v, exists := m[part]
		if !exists {
			return def
		}
		cur = v
	}
	if cur == nil {
		return def
	}
	return cur
}

// formatID renders a numeric or string id without scientific notation — Go's
// default %v on a float64 switches to scientific notation for large values
// (e.g. 1.07414278e+08), which would corrupt anything built from it (a dedupe
// key, a URL, a log line).
func formatID(v any) string {
	switch x := v.(type) {
	case nil:
		return ""
	case float64:
		return strconv.FormatFloat(x, 'f', -1, 64)
	case int:
		return strconv.Itoa(x)
	case string:
		return x
	default:
		return fmt.Sprintf("%v", x)
	}
}

// trimLongFraction cuts fractional seconds beyond 6 digits (ShipBob sends 7); Go's
// time layouts choke on more than 9 but clamp does string-prefix comparisons that
// assume a fixed 6-digit width, matching every other language's port here.
var trimLongFraction = regexp.MustCompile(`(\.\d{6})\d+`)

// parseTimestamp parses a ShipBob- or Pandium-shaped timestamp string, trying
// progressively looser layouts. Returns ok=false on anything unparseable.
func parseTimestamp(value string) (time.Time, bool) {
	if value == "" {
		return time.Time{}, false
	}
	trimmed := trimLongFraction.ReplaceAllString(value, "$1")
	layouts := []string{
		time.RFC3339Nano,
		"2006-01-02T15:04:05.999999",
		"2006-01-02T15:04:05",
		"2006-01-02",
	}
	for _, layout := range layouts {
		if t, err := time.Parse(layout, trimmed); err == nil {
			return t.UTC(), true
		}
	}
	return time.Time{}, false
}

// WebhookDelivery is one webhook delivery handed to this run: the raw request body,
// plus the trigger id, which is useful for correlating with the run log.
type WebhookDelivery struct {
	ID   string
	Body string
}

// Pandium is everything Pandium hands to an integration at runtime. Config
// (PAN_CFG_*) and Secrets (PAN_SEC_*) hold arbitrary keys defined per integration
// and are exposed as plain maps. Context (PAN_CTX_*) is controlled by Pandium, so
// its values are surfaced through named methods instead.
type Pandium struct {
	Config  map[string]string
	Secrets map[string]string
	context map[string]string

	metadataOnce sync.Once
	metadataVal  map[string]any
}

func NewPandiumFromEnv() *Pandium {
	return &Pandium{
		Config:  fromEnv("PAN_CFG_"),
		Secrets: fromEnv("PAN_SEC_"),
		context: fromEnv("PAN_CTX_"),
	}
}

// NewPandium builds a Pandium directly from plain maps, for tests.
func NewPandium(config, secrets, context map[string]string) *Pandium {
	return &Pandium{Config: config, Secrets: secrets, context: context}
}

// RunMode is the run mode for this invocation (e.g. "init", "webhook").
func (p *Pandium) RunMode() string {
	return p.context["run_mode"]
}

// RunTriggers are the triggers that caused this run, parsed from JSON. Relevant for
// webhook invocations, where each trigger's payload.file names a file holding the
// raw webhook body.
func (p *Pandium) RunTriggers() []map[string]any {
	raw, ok := p.context["run_triggers"]
	if !ok || raw == "" {
		return nil
	}
	var triggers []map[string]any
	if err := json.Unmarshal([]byte(raw), &triggers); err != nil {
		logger.Error(fmt.Sprintf("could not parse run triggers as JSON: %s: %s", raw, err))
		return nil
	}
	return triggers
}

// WebhookDeliveries are the webhook deliveries bundled into this run.
//
// Pandium debounces triggers per tenant, so deliveries that arrive while a run is
// in flight are bundled into the next one — a webhook run carries N of these, not
// one.
func (p *Pandium) WebhookDeliveries() []WebhookDelivery {
	var deliveries []WebhookDelivery
	for _, trigger := range p.RunTriggers() {
		if trigger["mode"] != "webhook" {
			continue
		}
		payload, _ := trigger["payload"].(map[string]any)
		file, _ := payload["file"].(string)
		if file == "" {
			logger.Error(fmt.Sprintf("webhook trigger %s has no payload file", formatID(trigger["id"])))
			continue
		}
		raw, err := os.ReadFile(file)
		if err != nil {
			logger.Error(fmt.Sprintf("could not read webhook payload %s: %s", file, err))
			continue
		}
		id := formatID(trigger["id"])
		deliveries = append(deliveries, WebhookDelivery{ID: id, Body: string(raw)})
	}
	return deliveries
}

// Metadata is the tenant metadata persisted by the previous run, parsed as JSON.
// Returns nil if there is none or it could not be read/parsed.
func (p *Pandium) Metadata() map[string]any {
	p.metadataOnce.Do(func() {
		filename, ok := p.context["tenant_metadata_file"]
		if !ok || filename == "" {
			return
		}
		raw, err := os.ReadFile(filename)
		if err != nil {
			logger.Error(fmt.Sprintf("could not read tenant metadata from %s: %s", filename, err))
			return
		}
		var metadata map[string]any
		if err := json.Unmarshal(raw, &metadata); err != nil {
			logger.Error(fmt.Sprintf("could not parse tenant metadata %s as JSON: %s", filename, err))
			return
		}
		p.metadataVal = metadata
	})
	return p.metadataVal
}

// UpdateMetadata merges metadata into the tenant metadata that the next run reads
// back. Pandium captures stdout and merges it into the stored tenant metadata, so
// this is the only thing that should ever be written there.
func (p *Pandium) UpdateMetadata(metadata map[string]any) {
	serialized, err := json.Marshal(metadata)
	if err != nil {
		logger.Error(fmt.Sprintf("could not serialize metadata: %s", err))
		return
	}
	logger.Info(fmt.Sprintf("updating metadata with %s", serialized))
	fmt.Println(string(serialized))
}
