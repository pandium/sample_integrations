// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from 'dotenv'
// Client Imports

// Logs go to stderr; stdout is reserved for the JSON metadata Pandium reads back.
dotenv.config({ quiet: true })

import log4js from 'log4js'

import { Pandium } from './lib.js'

// lib.js configures log4js; this just gets a logger named for this file.
const logger = log4js.getLogger('index')

/** The business logic of the run varies depending on the run mode. */
const run = async (
    mode: string | undefined,
    pandium: Pandium
): Promise<any> => {
    switch (mode) {
        case 'init':
            // Init mode: report which secrets are available and populate tenant metadata
            // with the dynamic config values needed for the customer-facing config form. In
            // the real world, these values would be derived from an api call.
            logger.info(
                `The available secrets are: ${Object.keys(pandium.secrets).join(
                    ', '
                )}`
            )
            return {
                dynamic_colors: ['red', 'green', 'purple', 'orange', 'yellow'],
            }

        case 'webhook': {
            // Webhook mode: log each trigger's headers and body. This version emits no
            // metadata, but there is no reason not to update metadata from here.
            for (const payload of pandium.webhookPayloads()) {
                logger.info(JSON.stringify(payload))
            }
            return {}
        }

        default: {
            // Normal mode: log the config, then log the previous normal run's random number
            // and store a fresh random number as metadata.
            logger.info(`Tenant configs: ${JSON.stringify(pandium.config)}`)
            const newRandomNumber = Math.floor(Math.random() * 1_000_000)
            const previousMetadata = pandium.metadata()
            if (previousMetadata) {
                logger.info(
                    `last run's random number: ${previousMetadata.random_number}`
                )
            }
            logger.info(`new random number: ${newRandomNumber}`)
            return { random_number: newRandomNumber }
        }
    }
}

const main = async () => {
    const abortController = new AbortController()
    const pandium = Pandium.fromEnv()

    logger.info('Hello from a Pandium integration, written in TypeScript!')
    logger.info(`This run is in mode: ${pandium.runMode()}`)

    // Example client code:

    const metadata = await run(pandium.runMode(), pandium)
    pandium.updateMetadata(metadata)
}

// Waiting for the resolution of the main function's promise is the entry point for the whole integration.
main().then(
    // When the promise is resolved no further action needed.
    () => {},
    // When the promise is rejected a nonzero exit code will fail the run.
    () => {
        process.exitCode = 1
    }
)
