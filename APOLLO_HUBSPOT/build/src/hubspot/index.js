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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import axios from 'axios';
import { exitHandler } from '../index.js';
import { namespaceLogger } from '../libs/logger.js';
var logger = namespaceLogger('HubSpot');
var Client = /** @class */ (function () {
    function Client(accessToken, metrics, nextContext) {
        var _this = this;
        this._errorCount = 0;
        this.generateCompanies = function (params) {
            return _this.generateResources('companies', 'objects/companies', params);
        };
        var authString = 'Bearer ' + accessToken;
        var headers = {
            Authorization: authString,
            accept: 'application/json',
        };
        this._axiosInstance = axios.create({
            baseURL: 'https://api.hubapi.com/crm/v3/',
            headers: headers,
        });
        this.metrics = metrics;
        this.context = nextContext;
        this._axiosInstance.interceptors.response.use(function (resp) {
            _this._errorCount = 0;
            return resp;
        }, function (error) {
            var _a;
            _this._errorCount++;
            if (axios.isAxiosError(error)) {
                // Kill the sync if we have an 401
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    logger.error('❌ HubSpot Auth error. Stopping execution');
                    exitHandler(false, 1, _this.metrics, _this.context);
                }
                if (_this._errorCount > 10) {
                    logger.error('❌ Potential runaway error. Stopping execution');
                    exitHandler(false, 5, _this.metrics, _this.context);
                }
            }
            return Promise.reject(error);
        });
        this.getCompanyProperties = this.createGetResource('company_properties', 'properties/companies');
        this.createCompanyProperty = this.createPostResource('company_properties', 'properties/companies');
        this.updateCompanies = this.createBulkResourceUpdate('companies', 'objects/companies/batch/update');
    }
    // For resources that do not require pagination
    Client.prototype.createGetResource = function (resource, url) {
        var _this = this;
        return function (params) { return __awaiter(_this, void 0, void 0, function () {
            var resources, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resources = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger.debug("Fetching ".concat(resource, " records from HubSpot"));
                        return [4 /*yield*/, this._axiosInstance.get(url, { params: params })];
                    case 2:
                        data = (_a.sent()).data;
                        resources = data.results;
                        this.metrics.incrementClientMetrics('hubspot', resource, 'fetched', 'success', data.results.length);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        logger.error("\u274C There was an error while attempting to fetch ".concat(resource, " from HubSpot: ").concat(error_1, "."));
                        this.metrics.incrementClientMetrics('hubspot', resource, 'fetched', 'error');
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/, resources];
                }
            });
        }); };
    };
    // For paged resources.
    Client.prototype.generateResources = function (resource, url, params) {
        return __asyncGenerator(this, arguments, function generateResources_1() {
            var data, _i, _a, result, error_2;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 10];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, , 9]);
                        logger.debug("Fetching HubSpot ".concat(resource, " records from ").concat(params.after
                            ? "page cursor: ".concat(params.after)
                            : 'the first page', "."));
                        return [4 /*yield*/, __await(this._axiosInstance.get(url, { params: params }))];
                    case 2:
                        data = (_d.sent()).data;
                        this.metrics.incrementClientMetrics('hubspot', resource, 'fetched', 'success', data.results.length);
                        _i = 0, _a = data.results;
                        _d.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        result = _a[_i];
                        result.page = params.after;
                        return [4 /*yield*/, __await(result)];
                    case 4: return [4 /*yield*/, _d.sent()];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7:
                        if (!((_c = (_b = data.paging) === null || _b === void 0 ? void 0 : _b.next) === null || _c === void 0 ? void 0 : _c.after))
                            return [3 /*break*/, 10];
                        params.after = data.paging.next.after;
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _d.sent();
                        logger.error("\u274C There was an error while attempting to fetch ".concat(resource, " for cursor ").concat(this.context.resources[resource].page, " from HubSpot: ").concat(error_2, "."));
                        this.metrics.incrementClientMetrics('hubspot', resource, 'fetched', 'error');
                        return [3 /*break*/, 10];
                    case 9: return [3 /*break*/, 0];
                    case 10: return [4 /*yield*/, __await(void 0)];
                    case 11: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    Client.prototype.createPostResource = function (resourceName, url) {
        var _this = this;
        return function (resoucePayload) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._axiosInstance.post(url, resoucePayload)];
                    case 1:
                        data = (_a.sent()).data;
                        logger.debug("\u2705 Created ".concat(resourceName, " in HubSpot"));
                        this.metrics.incrementClientMetrics('hubspot', resourceName, 'created', 'success', 1);
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        logger.error("\u274C There was an error while attempting to create a ".concat(resourceName, " in HubSpot: ").concat(error_3));
                        logger.error(JSON.stringify(resoucePayload));
                        this.metrics.incrementClientMetrics('hubspot', resourceName, 'created', 'error');
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    };
    Client.prototype.createBulkResourceUpdate = function (resourceName, url) {
        var _this = this;
        return function (updateRequest) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._axiosInstance.post(url, updateRequest)];
                    case 1:
                        data = (_a.sent()).data;
                        logger.debug("\u2705 Updated ".concat(resourceName, " successfully in HubSpot."));
                        this.metrics.incrementClientMetrics('hubspot', resourceName, 'updated', 'success', data.results.length);
                        return [2 /*return*/, data.results];
                    case 2:
                        error_4 = _a.sent();
                        logger.error("\u274C There was an error while attempting to update ".concat(resourceName, " in HubSpot: ").concat(error_4));
                        logger.error(JSON.stringify(updateRequest));
                        this.metrics.incrementClientMetrics('hubspot', resourceName, 'updated', 'error');
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    };
    return Client;
}());
export default Client;
