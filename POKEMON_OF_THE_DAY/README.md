# Pokémon Of The Day

## Intro

Pokémon Of The Day is a simple integration built to be run on Pandium.  This is the result of Pandium's Pokémon of the Day tutorial: Part 2.

## Integration Features:

- On a normal run it will identify & fetch the Pokémon of the day and then send a Slack message about it.
- The user can choose which type of Pokémon they would like to get messages about: It will read the different types of Pokémon available from the PokéAPI to dynamically populate the options for that config.  This will ensure the list is kept up to date even if a new kind of Pokémon is added.
- The user can choose who will receive the Slack Message about the Pokémon of the day:  It will read the different users available from the Slack workspace to dynamically populate the options for that config.
- The integration will not send a message about the same Pokémon twice.  The ID of the last Pokémon sent is stored in the tenant's metadata, along with the options for the two dynamic configs.

## Running Locally

Install the [Pandium CLI](https://docs.pandium.com/getting-started/pandium-integration-development-kit-idk/pandium-cli), log in with `pandium login`, then run the integration with the secrets, configs, and metadata of one of your tenants:

```
pandium local build
pandium local run <tenant-id>              # normal sync
pandium local run <tenant-id> --mode init  # init sync
```

## Next Steps in learning to write Pandium integrations

For those who want to hone their integration writing skills after completing this integration, consider what additions would be needed to handle the following situations:

- There are no more Pokémon of the selected type which have not yet been the Pokémon of the day.
- The user changes the selected Pokémon type after some Pokémon have already been sent.
- The Slack workspace has more users than a single page of `users.list` returns.
