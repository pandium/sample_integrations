// To get access to the .env where Pandium secrets, configs, and context can be read.
import * as dotenv from 'dotenv'
// Logs go to stderr; stdout is reserved for the JSON metadata Pandium reads back.
dotenv.config({ quiet: true })

import log4js from 'log4js'

import * as cron from './cron.js'
import { Pandium } from './lib.js'
import * as webhook from './webhook.js'

// lib.js configures log4js; this just gets a logger named for this file.
const logger = log4js.getLogger('index')

const run = async (mode, pandium) => {
    switch (mode) {
        case 'webhook':
            // Webhook mode: ShipBob order webhook deliveries (Pandium debounces them
            // into one run) -> a Gorgias ticket per shipment status not seen yet.
            return webhook.run(pandium)

        default:
            // Normal mode: the scheduled ShipBob orders -> Gorgias customer sync.
            return cron.run(pandium)
    }
}

const main = async () => {
    const pandium = Pandium.fromEnv()

    logger.info(`Syncing ShipBob to Gorgias; this run is in mode: ${pandium.runMode()}`)

    const metadata = await run(pandium.runMode(), pandium)
    pandium.updateMetadata(metadata)
}

// Waiting for the resolution of the main function's promise is the entry point for the
// whole integration.
main().then(
    // When the promise is resolved no further action needed.
    () => {},
    // When the promise is rejected a nonzero exit code will fail the run.
    () => {
        process.exitCode = 1
    }
)
