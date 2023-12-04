export var pokemonToSlackMessage = function (pokemon, channel) {
    var _a;
    var abilities = pokemon.abilities
        .map(function (ability) { return ability.ability.name; })
        .join(", ");
    var text = "The Pokemon of the Day is *".concat(pokemon.name, "*!\n        *Abilties:* ").concat(abilities, "\n        *Base Experience:* ").concat(pokemon.base_experience, "\n        *Height:* ").concat(pokemon.height, "\n        *Weight:* ").concat(pokemon.weight);
    var message = {
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
        (_a = message.blocks) === null || _a === void 0 ? void 0 : _a.unshift({
            type: "image",
            image_url: pokemon.sprites.back_default,
            alt_text: "".concat(pokemon.name, " sprite"),
        });
    }
    return message;
};
