import { WebClient } from "@slack/web-api";
import Pokedex from "pokedex-promise-v2";
import { OneOfOption } from "../models.js";

/* 
This flow fetches slack_users and pokemon_types and prints them to the standard out. 
This allows the Pandium platform to use them to populate options for the pokemon_type 
and slack_user dynamic configs.
*/
export const initSync = async (pokeClient: Pokedex, slackClient: WebClient) => {
  console.error("------------------------INIT SYNC------------------------");

  let pokemonTypes: string[] = [];
  try {
    const { results: types } = await pokeClient.getTypesList();
    pokemonTypes = types.map((type) => type.name);
  } catch (error) {
    console.error(error);
  }

  const slackUsers: OneOfOption[] = [];
  try {
    const response = await slackClient.users.list();

    response.members?.forEach((user) => {
      if (
        user.deleted ||
        user.is_bot ||
        !user.is_email_confirmed ||
        !user.id ||
        !user.name
      )
        return;

      slackUsers.push({
        const: user.id,
        title: user.name,
      });
    });
  } catch (error) {
    console.error(error);
    return {};
  }

  return {
    slack_users: slackUsers,
    pokemon_types: pokemonTypes,
  };
};
