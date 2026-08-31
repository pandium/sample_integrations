package main

import (
	"fmt"
	"os"
)

var mainLogger = newLogger("main")

// run's business logic varies depending on the run mode.
func run(mode string, pandium *Pandium) (map[string]any, error) {
	switch mode {
	case "webhook":
		// Webhook mode: ShipBob order webhook deliveries (Pandium debounces them
		// into one run) -> a Gorgias ticket per shipment status not seen yet.
		return webhookRun(pandium)

	default:
		// Normal mode: the scheduled ShipBob orders -> Gorgias customer sync.
		return cronRun(pandium)
	}
}

func main() {
	pandium := NewPandiumFromEnv()

	mainLogger.Info(fmt.Sprintf("Syncing ShipBob to Gorgias; this run is in mode: %s", pandium.RunMode()))

	metadata, err := run(pandium.RunMode(), pandium)
	if err != nil {
		mainLogger.Error(fmt.Sprintf("run failed: %s", err))
		os.Exit(1)
	}
	pandium.UpdateMetadata(metadata)
}
