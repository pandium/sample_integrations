import PokeClient from "../clients/pokemon";
import { WebClient } from "@slack/web-api";
import { Config, Context } from "../lib";
import { pokemonToSlackMessage } from "../clients/pokemon/transformations";

/* 
This flow identifies the Pokémon of the day and sends a Slack message about
it to the user selected in the config.
*/

export const pokemonSync = async (
  pokeClient: PokeClient,
  slackClient: WebClient,
  config: Config,
  context: Context
) => {
  console.error("------------------------POKEMON SYNC------------------------");

  // Fetch the pokemon of the type selected by the user in tenant settings.
  const pokemonType = await pokeClient.getType(config.pokemon_type);

  const pokemonOptions = pokemonType.pokemon;

  // Access the previous pokemon of the day from context
  let lastPokemonId = 0;
  if (context.last_successful_run_std_out) {
    const lastStdOut = JSON.parse(context.last_successful_run_std_out);
    lastPokemonId = Number(lastStdOut.last_pokemon_id) || 0;
  }

  // Find the first pokémon of the selected type which has not already been the pokémon of the day
  let nextPokemonId: string | undefined;
  for (const pokemon of pokemonOptions) {
    const pokemonId = Number(pokemon.pokemon.url.split("/").slice(-2, -1)[0]);
    if (pokemonId <= lastPokemonId) continue;
    nextPokemonId = String(pokemonId);
    break;
  }
  if (!nextPokemonId) return { last_pokemon_id: lastPokemonId };

  const pokemonOfTheDay = await pokeClient.getPokemon(nextPokemonId);

  const slackMessage = pokemonToSlackMessage(
    pokemonOfTheDay,
    config.slack_user
  );

  await slackClient.chat.postMessage(slackMessage);

  return { last_pokemon_id: nextPokemonId };
};
