import { WebClient } from "@slack/web-api";
import PokeClient from "../clients/pokemon";
import { OneOfOption } from "../sharedModels";
import { PokemonTypeSearchResult } from "../clients/pokemon/models";

export const initSync = async (
  pokeClient: PokeClient,
  slackClient: WebClient
) => {
  console.error("------------------------INIT SYNC------------------------");
  let pokemonTypes: string[] = [];

  try {
    const types = await pokeClient.getTypes();
    pokemonTypes = (types as PokemonTypeSearchResult[]).map(
      (type) => type.name
    );
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
