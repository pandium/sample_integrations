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
import * as dotenv from 'dotenv';
dotenv.config();
import HubSpot from './hubspot/index.js';
import Apollo from './apollo/index.js';
import { companySync } from './processLogic/companySync.js';
import { initSync } from './processLogic/initSync.js';
import { Config, Secret, Context } from './libs/lib.js';
import Metrics from './libs/metrics/metrics.js';
import { namespaceLogger } from './libs/logger.js';
import NextContext from './libs/nextContext/nextContext.js';
var logger = namespaceLogger('Main');
export var exitHandler = function (timedout, exitCode, metrics, nextContext) {
    var _a, _b;
    logger.info('------------------------RUN SUMMARY------------------------');
    if (timedout) {
        logger.info('Reaching 9 Minute Run Limit.  Saving Standard out and exiting run.');
    }
    metrics.printMetrics(logger);
    // Maintain context from last run when it is an init sync
    if (process.env.PAN_CTX_LAST_SUCCESSFUL_RUN_STD_OUT &&
        process.env.PAN_CTX_RUN_MODE !== 'normal') {
        var lastStandardOut = JSON.parse(process.env.PAN_CTX_LAST_SUCCESSFUL_RUN_STD_OUT);
        var standardOutFields = [
            'page',
            'lastStartDate',
        ];
        for (var _i = 0, standardOutFields_1 = standardOutFields; _i < standardOutFields_1.length; _i++) {
            var standardOutField = standardOutFields_1[_i];
            if (lastStandardOut[standardOutField] &&
                !nextContext.resources['companies'][standardOutField]) {
                nextContext.resources['companies'][standardOutField] =
                    lastStandardOut[standardOutField];
            }
        }
    }
    console.log(JSON.stringify({
        lastStartDate: ((_a = nextContext.resources['companies']) === null || _a === void 0 ? void 0 : _a.lastStartDate) || '',
        page: ((_b = nextContext.resources['companies']) === null || _b === void 0 ? void 0 : _b.page) || '',
    }));
    process.exit(exitCode);
};
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var metrics, nextContext, exitTimeout, thisContext, secrets, config, hsClient, apClient, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                metrics = new Metrics();
                nextContext = new NextContext();
                logger.info('Initializing 9 minute timeout:');
                exitTimeout = setTimeout(function () { return exitHandler(true, 0, metrics, nextContext); }, 9 * 60 * 1000);
                thisContext = new Context();
                secrets = new Secret();
                config = new Config();
                logger.info("This run is in mode: ".concat(thisContext['run_mode']));
                logger.info('------------------------CONFIG------------------------');
                logger.info(JSON.stringify(config));
                logger.info('------------------------CONTEXT------------------------');
                logger.info(JSON.stringify(thisContext));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                hsClient = new HubSpot(secrets['hubspot-basic_api_key'], metrics, nextContext);
                apClient = new Apollo(secrets['apollo-io_api_key'], metrics, nextContext);
                return [4 /*yield*/, initSync(hsClient, metrics)];
            case 2:
                _a.sent();
                if (!(thisContext['run_mode'] === 'normal')) return [3 /*break*/, 4];
                return [4 /*yield*/, companySync(hsClient, apClient, thisContext, metrics, nextContext, config)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                logger.error("Encountered fatal error, stopping execution: ".concat(error_1));
                exitHandler(false, 1, metrics, nextContext);
                return [3 /*break*/, 6];
            case 6:
                exitHandler(false, 0, metrics, nextContext);
                return [2 /*return*/];
        }
    });
}); };
// Waiting for the resolution of the run function's promise is the entry point for the whole integration.
run().then(
// When the promise is resolved no further action needed.
function () {
    process.exit(0);
}, 
// When the promise is rejected a nonzero exit code will fail the run.
function (error) {
    logger.error("Encountered fatal error, stopping execution: ".concat(error));
    process.exit(1);
});
