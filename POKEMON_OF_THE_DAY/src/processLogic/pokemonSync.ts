import Pokedex from "pokedex-promise-v2";
import { WebClient } from "@slack/web-api";
import { pokemonToSlackMessage } from "../transformations.js";
import { Context } from "../lib.js";

/* 
This flow identifies the Pokémon of the day and sends a Slack message about
it to the users in slackMemberIds.
*/

export const pokemonSync = async (
  pokeClient: Pokedex,
  slackClient: WebClient,
  context: Context
) => {
  console.error("------------------------POKEMON SYNC------------------------");

  // Access the previous Pokémon of the day from context
  let lastPokemonId = 0;
  if (context.last_successful_run_std_out) {
    const lastStdOut = JSON.parse(context.last_successful_run_std_out);
    lastPokemonId = Number(lastStdOut.last_pokemon_id) || 0;
  }
  // Get the ID of the first Pokémon which has not already been the Pokémon of the day
  const nextPokemonId = lastPokemonId + 1;
  const pokemonOfTheDay = await pokeClient.getPokemonByName(nextPokemonId);

  const slackMemberIds = ["<YOUR-SLACK-MEMBER-ID>"];

  // Create a Slack Message Payload and send it to each of the slackMemberIds
  for (const slackID of slackMemberIds) {
    const slackMessage = pokemonToSlackMessage(pokemonOfTheDay, slackID);
    await slackClient.chat.postMessage(slackMessage);
  }

  return { last_pokemon_id: nextPokemonId };
};
