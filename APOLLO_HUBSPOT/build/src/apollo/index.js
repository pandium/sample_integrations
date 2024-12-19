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
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { exitHandler } from '../index.js';
import { namespaceLogger } from '../libs/logger.js';
var logger = namespaceLogger('Apollo');
var Client = /** @class */ (function () {
    function Client(apiKey, metrics, nextContext) {
        var _this = this;
        this._errorCount = 0;
        var headers = {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json',
        };
        this._axiosInstance = axios.create({
            baseURL: 'https://api.apollo.io/api/v1/',
            headers: headers,
        });
        this.metrics = metrics;
        this.context = nextContext;
        this._axiosInstance.interceptors.response.use(function (resp) {
            _this._errorCount = 0;
            return resp;
        }, function (error) {
            var _a, _b;
            _this._errorCount++;
            if (axios.isAxiosError(error)) {
                // Kill the sync if we have an 401
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    logger.error('❌ Apollo.io Auth error. Stopping execution');
                    exitHandler(false, 1, _this.metrics, _this.context);
                }
                if (_this._errorCount > 10) {
                    logger.error('❌ Potential runaway error. Stopping execution');
                    exitHandler(false, 5, _this.metrics, _this.context);
                }
                if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) == 429) {
                    var headers_1 = error.response.headers;
                    var dailyLimit = headers_1['x-rate-limit-24-hour'];
                    if (headers_1['x-hourly-usage'] === dailyLimit) {
                        logger.error("\u274C Daily ".concat(dailyLimit, " Limit of Apollo requests reached.  Stopping execution because this integration cannot accomplish more work today."));
                        exitHandler(false, 0, _this.metrics, _this.context);
                    }
                    var hourlyLimit = headers_1['x-rate-limit-hourly'];
                    if (headers_1['x-hourly-usage'] === hourlyLimit) {
                        logger.error("\u274C Hourly ".concat(hourlyLimit, " Limit of Apollo requests reached.  Stopping execution because this integration cannot accomplish more work this hour."));
                        exitHandler(false, 0, _this.metrics, _this.context);
                    }
                }
            }
            return Promise.reject(error);
        });
        axiosRetry(this._axiosInstance, {
            retries: 6,
            retryDelay: function (retryCount) { return 30000; }, //This wait is so long because the most likely Apollo error is that more than 20 requests were made in a minute.
            onRetry: function (retryCount) {
                logger.warn("Apollo.io retry attempted. Attempt number ".concat(retryCount));
            },
            retryCondition: function (error) {
                var _a, _b;
                // Check for reaching limit of requests per minute
                var requestsAllowedPerMin = (_a = error.response) === null || _a === void 0 ? void 0 : _a.headers['x-rate-limit-minute'];
                if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.headers['x-minute-usage']) ===
                    requestsAllowedPerMin) {
                    logger.error("\u274C ".concat(requestsAllowedPerMin, " requests per minute Limit of Apollo requests reached.  Pausing execution for 30 seconds."));
                    return true;
                }
                // Check if the error is a network error
                if (!error.response) {
                    return true;
                }
                // Check if the response status is a 5xx server error
                return (error.response.status >= 500 && error.response.status <= 599);
            },
        });
        this.bulkEnrichOrganizations = this.createBulkEnrich('organizations');
    }
    Client.prototype.createBulkEnrich = function (resource) {
        var _this = this;
        return function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var url, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger.debug("Getting enriched ".concat(resource, " from Apollo.io"));
                        url = "".concat(resource, "/bulk_enrich");
                        return [4 /*yield*/, this._axiosInstance.post(url, payload)];
                    case 1:
                        data = (_a.sent()).data;
                        this.metrics.incrementClientMetrics('apollo', resource, 'fetched', 'success', data.unique_enriched_records);
                        return [2 /*return*/, data[resource]];
                    case 2:
                        error_1 = _a.sent();
                        logger.error("\u274C There was an error while attempting to get enriched ".concat(resource, " from Apollo.io : ").concat(error_1));
                        this.metrics.incrementClientMetrics('apollo', resource, 'fetched', 'error', payload.domains.length);
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    };
    return Client;
}());
export default Client;
