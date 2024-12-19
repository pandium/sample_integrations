// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from 'dotenv'
dotenv.config()

import HubSpot from './hubspot/index.js'
import Apollo from './apollo/index.js'
import { companySync } from './processLogic/companySync.js'
import { initSync } from './processLogic/initSync.js'
import { Config, Secret, Context } from './libs/lib.js'
import Metrics from './libs/metrics/metrics.js'
import { ContextResourceProperties } from './libs/nextContext/types.js'
import { namespaceLogger } from './libs/logger.js'
import NextContext from './libs/nextContext/nextContext.js'
const logger = namespaceLogger('Main')

export const exitHandler = (
    timedout: boolean,
    exitCode: number,
    metrics: Metrics,
    nextContext: NextContext
) => {
    logger.info('------------------------RUN SUMMARY------------------------')
    if (timedout) {
        logger.info(
            'Reaching 9 Minute Run Limit.  Saving Standard out and exiting run.'
        )
    }

    metrics.printMetrics(logger)

    // Maintain context from last run when it is an init sync
    if (
        process.env.PAN_CTX_LAST_SUCCESSFUL_RUN_STD_OUT &&
        process.env.PAN_CTX_RUN_MODE !== 'normal'
    ) {
        const lastStandardOut = JSON.parse(
            process.env.PAN_CTX_LAST_SUCCESSFUL_RUN_STD_OUT
        )
        const standardOutFields: Array<keyof ContextResourceProperties> = [
            'page',
            'lastStartDate',
        ]
        for (const standardOutField of standardOutFields) {
            if (
                lastStandardOut[standardOutField] &&
                !nextContext.resources['companies'][standardOutField]
            ) {
                nextContext.resources['companies'][standardOutField] =
                    lastStandardOut[standardOutField]
            }
        }
    }

    console.log(
        JSON.stringify({
            lastStartDate:
                nextContext.resources['companies']?.lastStartDate || '',
            page: nextContext.resources['companies']?.page || '',
        })
    )

    process.exit(exitCode)
}

const run = async () => {
    const metrics = new Metrics()
    const nextContext = new NextContext()

    logger.info('Initializing 9 minute timeout:')
    const exitTimeout: ReturnType<typeof setTimeout> = setTimeout(
        () => exitHandler(true, 0, metrics, nextContext),
        9 * 60 * 1000
    )

    const thisContext = new Context()
    const secrets = new Secret()
    const config = new Config()

    logger.info(`This run is in mode: ${thisContext['run_mode']}`)

    logger.info('------------------------CONFIG------------------------')
    logger.info(JSON.stringify(config))

    logger.info('------------------------CONTEXT------------------------')
    logger.info(JSON.stringify(thisContext))

    try {
        const hsClient = new HubSpot(
            secrets['hubspot-basic_api_key'],
            metrics,
            nextContext
        )
        const apClient = new Apollo(
            secrets['apollo-io_api_key'],
            metrics,
            nextContext
        )

        await initSync(hsClient, metrics)

        if (thisContext['run_mode'] === 'normal') {
            await companySync(
                hsClient,
                apClient,
                thisContext,
                metrics,
                nextContext,
                config
            )
        }
    } catch (error) {
        logger.error(`Encountered fatal error, stopping execution: ${error}`)
        exitHandler(false, 1, metrics, nextContext)
    }

    exitHandler(false, 0, metrics, nextContext)
}

// Waiting for the resolution of the run function's promise is the entry point for the whole integration.
run().then(
    // When the promise is resolved no further action needed.
    () => {
        process.exit(0)
    },
    // When the promise is rejected a nonzero exit code will fail the run.
    (error) => {
        logger.error(`Encountered fatal error, stopping execution: ${error}`)
        process.exit(1)
    }
)
