import { Pokemon } from "./models";
import { ChatPostMessageArguments } from "@slack/web-api";

export const pokemonToSlackMessage = (
  pokemon: Pokemon,
  channel: string
): ChatPostMessageArguments => {
  const abilities = pokemon.abilities
    .map((ability) => ability.ability.name)
    .join(", ");
  const text = `The Pokemon of the Day is *${pokemon.name}*!
        *Abilties:* ${abilities}
        *Base Experience:* ${pokemon.base_experience}
        *Height:* ${pokemon.height}
        *Weight:* ${pokemon.weight}`;
  const message: ChatPostMessageArguments = {
    channel: channel,
    text: text,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: text,
        },
      },
    ],
  };

  if (pokemon.sprites.back_default) {
    message.blocks?.unshift({
      type: "image",
      image_url: pokemon.sprites.back_default,
      alt_text: `${pokemon.name} sprite`,
    });
  }
  return message;
};
