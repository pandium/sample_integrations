// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from "dotenv";
dotenv.config();
import { WebClient } from "@slack/web-api";
import Pokedex from "pokedex-promise-v2";
import { Config, Secret, Context } from "./lib.js";
import { pokemonSync } from "./processLogic/pokemonSync.js";

const run = async () => {
  const context = new Context();
  const secrets = new Secret();
  const config = new Config();

  // Pandium integrations can be run in 'init' or 'normal' mode.
  // When the integration is run on Pandium, Pandium will provide run_mode through context.
  // During loval development run mode is defined in the .env as PAN_CTX_RUN_MODE
  console.error(`This run is in mode: ${context["run_mode"]}`);
  console.error("------------------------CONFIG------------------------");
  console.error(config);

  console.error("------------------------CONTEXT------------------------");
  console.error(context);

  const pokeClient = new Pokedex();
  const slackClient = new WebClient(secrets.slack_oauth_access_token);

  if (context.run_mode === "normal") {
    const standardOut = await pokemonSync(pokeClient, slackClient, context);
    console.log(JSON.stringify(standardOut));
  }
};

// Waiting for the resolution of the run function's promise is the entry point for the whole integration.
run().then(
  // When the promise is resolved no further action needed.
  () => {},
  // When the promise is rejected a nonzero exit code will fail the run.
  () => {
    process.exitCode = 1;
  }
);
