// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from 'dotenv'
// Client Imports
import hubspotClient from '@pandium/hubspot-client'
import apolloioClient from '@pandium/apollo-io-client'

dotenv.config()

import { Config, Secret, Context } from './lib.js'

const run = async () => {
    const abortController = new AbortController()
    const context = new Context()
    const secrets = new Secret()
    const config = new Config()

    // Pandium integrations can be run in 'init' or 'normal' mode.
    // When the integration is run on Pandium, Pandium will provide run_mode through context.
    // During local development run mode is defined in the .env as PAN_CTX_RUN_MODE
    console.error(`This run is in mode: ${context['run_mode']}`)
    console.error('------------------------SHON------------------------')
    console.error(config)

    console.error('------------------------SECRET------------------------')
    console.error(secrets)

    console.error('------------------------CONTEXT------------------------')
    console.error(context)

    console.error('------------------------ENV----------------------------')
    console.error(process.env)

    // Example client code:
try {
    const hsToken =
        secrets.hubspot_oauth_access_token || secrets['hubspot_basic_api_key']
    const hsClient = new hubspotClient(abortController, undefined, hsToken)

    console.error('Fetching and Logging 10 Hubspot Contact')
    const hsContacts = await hsClient.api.crm.contacts.getAll()

    let contactCounter = 0
    for await (let customer of hsContacts) {
        if (contactCounter > 10) break
        console.error(customer) // Here, each iteration will yield your data whenever it's ready. No need for Promise callbacks or async/await calls here.
        contactCounter++
    }
} catch (error) {
    console.error('❌ Unexpected Hubspot error.')
    // @ts-ignore
    console.error(error.message)
    console.error(error)
}
try {
    const apiToken = secrets.apollo_io_api_key
    const apollo = new apolloioClient(
        'https://api.apollo.io/api/v1',
        abortController,
        apiToken
    )
    console.error('Fetching and Logging 10 Apollo.io Contact Names')
    let contactCounter = 0
    const contacts = await apollo.api.searchContacts(undefined)
    for await (const contact of contacts) {
        if (contactCounter > 10) break
        console.error(
            JSON.stringify(`${contact.first_name} ${contact.last_name} `)
        )
        contactCounter++
    }
} catch (error) {
    console.error('❌ Unexpected Apollo.io error.')
    // @ts-ignore
    console.error(error.message)
    console.error(error)
}
}

// Waiting for the resolution of the run function's promise is the entry point for the whole integration.
run().then(
    // When the promise is resolved no further action needed.
    () => {},
    // When the promise is rejected a nonzero exit code will fail the run.
    () => {
        process.exitCode = 1
    }
)
