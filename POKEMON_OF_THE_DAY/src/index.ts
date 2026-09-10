import * as dotenv from 'dotenv'
dotenv.config({ quiet: true })
import log4js from 'log4js'
import { WebClient } from '@slack/web-api'
import Pokedex from 'pokedex-promise-v2'
import { Pandium } from './lib.js'
import { pokemonSync } from './processLogic/pokemonSync.js'

// lib.js configures log4js; this just gets a logger named for this file.
const logger = log4js.getLogger('index')

const main = async () => {
    // Everything Pandium passed to this run: configs, secrets, and context.
    // Locally, `pandium local run <tenant-id>` supplies the same values from the tenant.
    const pandium = Pandium.fromEnv()
    logger.info(`This run is in mode: ${pandium.runMode()}`)
    logger.info(`Tenant configs: ${JSON.stringify(pandium.config)}`)

    const pokeClient = new Pokedex()
    const slackClient = new WebClient(pandium.secrets.slack_oauth_access_token)

    // Pandium integrations can be run in 'init' or 'normal' mode.
    // pokemonSync returns the metadata to save for the tenant; updateMetadata prints it
    // to stdout, where Pandium reads it back at the end of the run.
    if (pandium.runMode() === 'normal') {
        const metadata = await pokemonSync(pokeClient, slackClient, pandium)
        pandium.updateMetadata(metadata)
    }
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
