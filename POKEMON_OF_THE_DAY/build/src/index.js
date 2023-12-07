var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// To get Access to the .env where Pandium secrets, configs, and context can be accessed.
import * as dotenv from "dotenv";
dotenv.config();
import { WebClient } from "@slack/web-api";
import Pokedex from "pokedex-promise-v2";
import { Config, Secret, Context } from "./lib.js";
import { pokemonSync } from "./processLogic/pokemonSync.js";
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var context, secrets, config, pokeClient, slackClient, standardOut;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                context = new Context();
                secrets = new Secret();
                config = new Config();
                // Pandium integrations can be run in 'init' or 'normal' mode.
                // When the integration is run on Pandium, Pandium will provide run_mode through context.
                // During loval development run mode is defined in the .env as PAN_CTX_RUN_MODE
                console.error("This run is in mode: ".concat(context["run_mode"]));
                console.error("------------------------CONFIG------------------------");
                console.error(config);
                console.error("------------------------CONTEXT------------------------");
                console.error(context);
                pokeClient = new Pokedex();
                slackClient = new WebClient(secrets.slack_oauth_access_token);
                if (!(context.run_mode === "normal")) return [3 /*break*/, 2];
                return [4 /*yield*/, pokemonSync(pokeClient, slackClient, context)];
            case 1:
                standardOut = _a.sent();
                console.log(JSON.stringify(standardOut));
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
// Waiting for the resolution of the run function's promise is the entry point for the whole integration.
run().then(
// When the promise is resolved no further action needed.
function () { }, 
// When the promise is rejected a nonzero exit code will fail the run.
function () {
    process.exitCode = 1;
});
