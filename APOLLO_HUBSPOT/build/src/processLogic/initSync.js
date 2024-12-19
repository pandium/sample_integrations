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
import { namespaceLogger } from '../libs/logger.js';
var logger = namespaceLogger('Init Sync');
export var CUSTOM_DATE_PROPERTY = 'apollo_enriched_date';
var CUSTOM_COMPANY_SIZE_PROPERTY = 'company_size';
export var initSync = function (hsClient, metrics) { return __awaiter(void 0, void 0, void 0, function () {
    var companyProperties, customDateProperty, customDatePropertyPayload, newCustomDateProperty, customSizeProperty, customSizePropertyPayload, newCustomSizeProperty;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.info('----------------------- STARTING INIT SYNC -----------------------');
                return [4 /*yield*/, hsClient.getCompanyProperties({
                        properties: 'name',
                    })];
            case 1:
                companyProperties = _a.sent();
                if (!companyProperties) {
                    throw new Error("Unable to check if ".concat(CUSTOM_DATE_PROPERTY, " property exists on HubSpot companies."));
                }
                customDateProperty = companyProperties.find(function (property) { return property.name === CUSTOM_DATE_PROPERTY; });
                if (!!customDateProperty) return [3 /*break*/, 3];
                customDatePropertyPayload = {
                    hidden: true,
                    label: 'Date Last Enriched via Apollo',
                    type: 'datetime',
                    formField: false,
                    groupName: 'companyinformation',
                    name: CUSTOM_DATE_PROPERTY,
                    hasUniqueValue: false,
                    fieldType: 'date',
                    externalOptions: false,
                };
                return [4 /*yield*/, hsClient.createCompanyProperty(customDatePropertyPayload)];
            case 2:
                newCustomDateProperty = _a.sent();
                if (!newCustomDateProperty) {
                    throw new Error("".concat(CUSTOM_DATE_PROPERTY, " does not exist and cannot be created."));
                }
                return [3 /*break*/, 4];
            case 3:
                logger.info("".concat(CUSTOM_DATE_PROPERTY, " is already a company property in HubSpot.  No need to create it."));
                _a.label = 4;
            case 4:
                customSizeProperty = companyProperties.find(function (property) { return property.name === CUSTOM_COMPANY_SIZE_PROPERTY; });
                if (!!customSizeProperty) return [3 /*break*/, 6];
                customSizePropertyPayload = {
                    hidden: false,
                    label: 'Company Size',
                    type: 'enumeration',
                    formField: false,
                    groupName: 'companyinformation',
                    name: CUSTOM_COMPANY_SIZE_PROPERTY,
                    hasUniqueValue: false,
                    fieldType: 'select',
                    options: [
                        {
                            label: 'Less than 50',
                            value: 'Less than 50',
                            displayOrder: 0,
                            hidden: false,
                        },
                        {
                            label: '51-100',
                            value: '50-100',
                            displayOrder: 1,
                            hidden: false,
                        },
                        {
                            label: '101-500',
                            value: '100-500',
                            displayOrder: 2,
                            hidden: false,
                        },
                        {
                            label: '501-5,000',
                            value: '500+',
                            displayOrder: 3,
                            hidden: false,
                        },
                        {
                            label: '5,001+',
                            value: '5,001+',
                            displayOrder: 4,
                            hidden: false,
                        },
                    ],
                    externalOptions: false,
                };
                return [4 /*yield*/, hsClient.createCompanyProperty(customSizePropertyPayload)];
            case 5:
                newCustomSizeProperty = _a.sent();
                if (!newCustomSizeProperty) {
                    throw new Error("".concat(CUSTOM_COMPANY_SIZE_PROPERTY, " does not exist and cannot be created."));
                }
                return [3 /*break*/, 7];
            case 6:
                logger.info("".concat(CUSTOM_COMPANY_SIZE_PROPERTY, " is already a company property in HubSpot.  No need to create it."));
                _a.label = 7;
            case 7:
                logger.info('-----------------------  INIT SYNC COMPLETED -----------------------');
                return [2 /*return*/];
        }
    });
}); };
