import * as dotenv from "dotenv";
// This gives access to process.env which is where Pandium secrets, configs, and context are kept.
dotenv.config();
import { WebClient } from "@slack/web-api";
import Pokedex from "pokedex-promise-v2";
import { Config, Secret, Context } from "./lib.js";
import { initSync } from "./processLogic/initSync.js";
import { pokemonSync } from "./processLogic/pokemonSync.js";

const run = async () => {
  const context = new Context();
  const secrets = new Secret();
  const config = new Config();

  console.error(`This run is in mode: ${context["run_mode"]}`);
  console.error("------------------------CONFIG------------------------");
  console.error(config);

  console.error("------------------------CONTEXT------------------------");
  console.error(context);

  const pokeClient = new Pokedex();
  const slackClient = new WebClient(secrets.slack_token);

  if (context.run_mode === "init") {
    const initStdOut = await initSync(pokeClient, slackClient);
    console.log(JSON.stringify(initStdOut));
  } else {
    const normalStdOut = await pokemonSync(
      pokeClient,
      slackClient,
      config,
      context
    );
    console.log(JSON.stringify(normalStdOut));
  }
};

run().then(
  () => {},
  () => {
    process.exitCode = 1;
  }
);
