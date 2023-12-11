# Pokémon Of The Day


## Intro

Pokémon Of The Day is a simple integration built to be run on Pandium.  This is the result of Pandium's Pokémon of the Day tutorial: Part 2.

## Integration Features:

- On a normal run it will identify & fetch the Pokémon of the day and then send a Slack message about it. 
- The user can choose which type of Pokémon they would like to get messages about: It will read the different types of Pokémon available from the PokéAPI to dynamically populate the options for that config.  This will ensure the list is kept up to date even if a new kind of Pokémon is added.
- The user can choose who will receive the Slack Message about the Pokémon of the day:  It will read the different users available from the Slack workspace to dynamically populate the options for that config.  
- The integration will not send a message about the same Pokémon twice.

## Next Steps in learning to write Pandium integrations

For those who want to hone their integration writing skills after completing this integration, consider what additions would be needed to handle the following situations:
- The user has not selected a Slack user or Pokémon Type.
- There are no more Pokémon of the selected type which have not yet been the Pokémon of the day.
- The user has switched back and forth between init and normal modes, and context needs to be maintained.