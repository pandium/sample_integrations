import log4js from 'log4js'
import { WebClient } from '@slack/web-api'
import Pokedex from 'pokedex-promise-v2'
import { OneOfOption } from '../models.js'

const logger = log4js.getLogger('initSync')

/*
This flow fetches slack_users and pokemon_types and returns them to be saved as
tenant metadata. The Pandium platform reads them from metadata to populate the
options for the pokemon_type and slack_user dynamic configs.
*/
export const initSync = async (pokeClient: Pokedex, slackClient: WebClient) => {
    logger.info('------------------------INIT SYNC------------------------')

    const { results: types } = await pokeClient.getTypesList()
    const pokemonTypes = types.map((type) => type.name)

    const slackUsers: OneOfOption[] = []
    const response = await slackClient.users.list({})

    response.members?.forEach((user) => {
        if (
            user.deleted ||
            user.is_bot ||
            !user.is_email_confirmed ||
            !user.id ||
            !user.name
        )
            return

        slackUsers.push({
            const: user.id,
            title: user.name,
        })
    })

    return {
        slack_users: slackUsers,
        pokemon_types: pokemonTypes,
    }
}
