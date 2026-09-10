# Pokémon Of The Day

## Intro

Pokémon Of The Day is a simple integration built to be run on Pandium.  This is the result of Pandium's Pokémon of the Day tutorial: Part 1.

## Integration Features:

- On a normal run it will identify & fetch the Pokémon of the day and then send a Slack message about it to the Academy's Pokémon trainers.
- The integration will not send a message about the same Pokémon twice.  The ID of the last Pokémon sent is stored in the tenant's metadata.

## Running Locally

Install the [Pandium CLI](https://docs.pandium.com/getting-started/pandium-integration-development-kit-idk/pandium-cli), log in with `pandium login`, then run the integration with the secrets and metadata of one of your tenants:

```
pandium local build
pandium local run <tenant-id>
```
