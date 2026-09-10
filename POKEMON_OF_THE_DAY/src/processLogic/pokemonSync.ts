import log4js from 'log4js'
import Pokedex from 'pokedex-promise-v2'
import { WebClient } from '@slack/web-api'
import { pokemonToSlackMessage } from '../transformations.js'
import { Pandium } from '../lib.js'

const logger = log4js.getLogger('pokemonSync')

/*
This flow identifies the Pokémon of the day and sends a Slack message about
it to the user selected in the tenant's connection settings.
*/
export const pokemonSync = async (
    pokeClient: Pokedex,
    slackClient: WebClient,
    pandium: Pandium
) => {
    logger.info('------------------------POKEMON SYNC------------------------')

    const { pokemon_type: selectedType, slack_user: slackUser } = pandium.config
    if (!selectedType || !slackUser) {
        throw new Error(
            'A Pokémon type and Slack user must be selected in the connection settings'
        )
    }

    // Fetch the Pokémon of the type selected by the user in tenant settings.
    const pokemonType = await pokeClient.getTypeByName(selectedType)
    const pokemonOptions = pokemonType.pokemon

    // Access the previous Pokémon of the day from the tenant metadata.
    const lastPokemonId = Number(pandium.metadata()?.last_pokemon_id) || 0
    logger.info(`The last Pokémon of the day was #${lastPokemonId}`)

    // Find the first Pokémon of the selected type which has not already been the Pokémon of the day.
    let nextPokemonId: number | undefined
    for (const pokemon of pokemonOptions) {
        const pokemonId = Number(pokemon.pokemon.url.split('/').slice(-2, -1)[0])
        if (pokemonId <= lastPokemonId) continue
        nextPokemonId = pokemonId
        break
    }
    if (!nextPokemonId) return { last_pokemon_id: lastPokemonId }

    const pokemonOfTheDay = await pokeClient.getPokemonByName(nextPokemonId)

    // Create and send the Slack Message about the Pokémon of the Day.
    const slackMessage = pokemonToSlackMessage(pokemonOfTheDay, slackUser)
    await slackClient.chat.postMessage(slackMessage)

    // Saved to the tenant metadata so the next run knows where to pick up.
    return { last_pokemon_id: nextPokemonId }
}
