import Pokedex from "pokedex-promise-v2";
import { WebClient } from "@slack/web-api";
import { pokemonToSlackMessage } from "../transformations.js";
import { Context, Config } from "../lib.js";

/* 
This flow identifies the Pokémon of the day and sends a Slack message about
it to the user selected in the config.
*/

export const pokemonSync = async (
  pokeClient: Pokedex,
  slackClient: WebClient,
  context: Context,
  config: Config
) => {
  console.error("------------------------POKEMON SYNC------------------------");

  // Fetch the Pokémon of the type selected by the user in tenant settings.
  const pokemonType = await pokeClient.getTypeByName(config.pokemon_type);
  const pokemonOptions = pokemonType.pokemon;

  // Access the previous Pokémon of the day from context
  let lastPokemonId = 0;
  if (context.last_successful_run_std_out) {
    const lastStdOut = JSON.parse(context.last_successful_run_std_out);
    lastPokemonId = Number(lastStdOut.last_pokemon_id) || 0;
  }

  // Find the first Pokémon of the selected type which has not already been the Pokémon of the day
  let nextPokemonId: string | undefined;
  for (const pokemon of pokemonOptions) {
    const pokemonId = Number(pokemon.pokemon.url.split("/").slice(-2, -1)[0]);
    if (pokemonId <= lastPokemonId) continue;
    nextPokemonId = String(pokemonId);
    break;
  }
  if (!nextPokemonId) return { last_pokemon_id: lastPokemonId };

  const pokemonOfTheDay = await pokeClient.getPokemonByName(nextPokemonId);

  // Create and send the Slack Message about the Pokémon of the Day.
  const slackMessage = pokemonToSlackMessage(
    pokemonOfTheDay,
    config.slack_user
  );
  await slackClient.chat.postMessage(slackMessage);

  return { last_pokemon_id: nextPokemonId };
};
