// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from 'dotenv'
dotenv.config()
import { WebClient } from '@slack/web-api'
import PokeClient from './clients/pokemon/index'
import { Config, Secret, Context } from './lib'
import { initSync } from './processLogic/initSync'
import { pokemonSync } from './processLogic/pokemonSync'

const run = async () => {
    const context = new Context()
    const secrets = new Secret()
    const config = new Config()

    console.error(`This run is in mode: ${context['run_mode']}`)
    console.error('------------------------CONFIG------------------------')
    console.error(config)

    console.error('------------------------CONTEXT------------------------')
    console.error(context)

    const pokeClient = new PokeClient()
    const slackClient = new WebClient(secrets.slack_token)
    // let standardOut: StandardOut = {}
    if (context.last_successful_run_std_out) {
        const lastStdOut = JSON.parse(context.last_successful_run_std_out)
        // standardOut = {...standardOut, ...lastStdOut }
    }
    if (context.run_mode === 'init') {
        const initStdOut = await initSync(pokeClient, slackClient)
        console.log(JSON.stringify(initStdOut))
        // standardOut = {...standardOut, ...initStdOut }
    } else {
        const normalStdOut = await pokemonSync(
            pokeClient,
            slackClient,
            config,
            context
        )
        console.log(JSON.stringify(normalStdOut))

        // standardOut = {...standardOut, ...normalStandardOut }
    }

    // console.log(JSON.stringify( standardOut ))
}

run().then(
    () => {},
    () => {
        process.exitCode = 1
    }
)
