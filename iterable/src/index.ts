// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from 'dotenv'
import GorgiasClient from '@pandium/gorgias-client'
import IterableClient from '@pandium/iterable-client'
import {syncGorgiasCustomersToIterableUsers} from './processLogic/syncGorgiasCustomersToIterableUsers.js'

dotenv.config()

import { Config, Secret, Context } from './lib.js'

const run = async () => {
    const abortController = new AbortController()
    const context = new Context()
    const secrets = new Secret()
    const config = new Config()
    console.log('something to commit')

    console.error(`This run is in mode: ${context['run_mode']}`)
    console.error('------------------------CONFIG------------------------')
    console.error(config)
    console.error('------------------------SECRET------------------------')
    console.error(secrets)
    console.error('------------------------CONTEXT------------------------')
    console.error(context)
    console.error('------------------------ENV----------------------------')
    console.error(process.env)

    const gorgias = new GorgiasClient(abortController)
    const iterable = new IterableClient(abortController)

    if (config.sync_gorgias_customers_to_iterable_users) {
        await syncGorgiasCustomersToIterableUsers(gorgias, iterable, config)
    } else (
        console.error('sync Gorgias Customers To Iterable Users is disabled.')
    )
}

run().then(
    () => {},
    (error) => {
        console.error("Unhandled error:", error);
        process.exitCode = 1
    }
)
