import log4js from 'log4js'
import Pokedex from 'pokedex-promise-v2'
import { WebClient } from '@slack/web-api'
import { pokemonToSlackMessage } from '../transformations.js'
import { Pandium } from '../lib.js'

const logger = log4js.getLogger('pokemonSync')

/*
This flow identifies the Pokémon of the day and sends a Slack message about
it to each of the Academy's Pokémon trainers.
*/
export const pokemonSync = async (
    pokeClient: Pokedex,
    slackClient: WebClient,
    pandium: Pandium
) => {
    logger.info('------------------------POKEMON SYNC------------------------')

    // Access the previous Pokémon of the day from the tenant metadata.
    const lastPokemonId = Number(pandium.metadata()?.last_pokemon_id) || 0
    logger.info(`The last Pokémon of the day was #${lastPokemonId}`)

    const nextPokemonId = lastPokemonId + 1
    const pokemonOfTheDay = await pokeClient.getPokemonByName(nextPokemonId)

    // Replace with the Slack member IDs of the Academy's Pokémon trainers.
    const slackMemberIds = ['<YOUR-SLACK-MEMBER-ID>']

    // Create and send the Slack Message about the Pokémon of the Day.
    for (const slackID of slackMemberIds) {
        const slackMessage = pokemonToSlackMessage(pokemonOfTheDay, slackID)
        await slackClient.chat.postMessage(slackMessage)
    }

    // Saved to the tenant metadata so the next run knows where to pick up.
    return { last_pokemon_id: nextPokemonId }
}
