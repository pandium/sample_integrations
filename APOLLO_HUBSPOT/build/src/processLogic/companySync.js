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
import { hsCompaniesToApEnrichmentRequest } from '../hubspot/transformations.js';
import { enrichedApOrganizationsToUpdatedHsCompany } from '../apollo/transformations.js';
var logger = namespaceLogger('Company Sync');
export var companySync = function (hsClient, apClient, thisContext, metrics, nextContext, config) { return __awaiter(void 0, void 0, void 0, function () {
    var lastRunStdOut, firstPageForThisSync, now, lastStartDate, companyParams, companyBatch, getHsCompanies, next, hsCompany, companyEnrichedDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.info('----------------------- STARTING COMPANY SYNC -----------------------');
                lastRunStdOut = JSON.parse(thisContext.last_successful_run_std_out || '{}');
                firstPageForThisSync = (lastRunStdOut === null || lastRunStdOut === void 0 ? void 0 : lastRunStdOut.page) || '';
                nextContext.updateResourceContext('companies', 'page', firstPageForThisSync);
                logger.info("This run will fetch HubSpot companies starting with ".concat(firstPageForThisSync
                    ? "page cursor ".concat(firstPageForThisSync, " because that is where the last run left off")
                    : 'the first page', "."));
                now = new Date().toISOString();
                lastStartDate = firstPageForThisSync
                    ? (lastRunStdOut === null || lastRunStdOut === void 0 ? void 0 : lastRunStdOut.lastStartDate) || now
                    : now;
                nextContext.updateResourceContext('companies', 'lastStartDate', lastStartDate);
                logger.info("This run will process HubSpot companies that have not been updated since ".concat(nextContext.resources['companies'].lastStartDate, "."));
                companyParams = {
                    limit: config.hubspot_records_per_page,
                    properties: 'apollo_enriched_date,domain,name',
                };
                if (firstPageForThisSync) {
                    companyParams.after = firstPageForThisSync;
                }
                companyBatch = [];
                getHsCompanies = hsClient.generateCompanies(companyParams);
                _a.label = 1;
            case 1: return [4 /*yield*/, getHsCompanies.next()];
            case 2:
                if (!!(next = _a.sent()).done) return [3 /*break*/, 5];
                hsCompany = next.value;
                companyEnrichedDate = hsCompany.properties.apollo_enriched_date;
                if (companyEnrichedDate && companyEnrichedDate > lastStartDate) {
                    logger.debug("Will not get Apollo.io Enriched information for the Hubspot Company ".concat(hsCompany.id, ": ").concat(hsCompany.properties.name, " because it was enriched on ").concat(companyEnrichedDate, " which is after ").concat(lastStartDate));
                    return [3 /*break*/, 1];
                }
                if (!hsCompany.properties.domain) {
                    logger.warn("Cannot get Apollo.io Enriched information for the Hubspot Company ".concat(hsCompany.id, ": ").concat(hsCompany.properties.name, " because it has no domain in Hubspot"));
                    metrics.incrementSyncMetrics('companySync', 'companies', 'error');
                    return [3 /*break*/, 1];
                }
                companyBatch.push(hsCompany);
                if (!(companyBatch.length === 10)) return [3 /*break*/, 4];
                return [4 /*yield*/, processCompanyBatch(apClient, hsClient, companyBatch, nextContext, metrics /*,
                    config*/)];
            case 3:
                _a.sent();
                companyBatch = [];
                _a.label = 4;
            case 4: return [3 /*break*/, 1];
            case 5:
                if (!companyBatch.length) return [3 /*break*/, 7];
                return [4 /*yield*/, processCompanyBatch(apClient, hsClient, companyBatch, nextContext, metrics /*,
                    config*/)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                // Set the context's page number to be empty so the next run starts over with the first page.
                nextContext.updateResourceContext('companies', 'page', '');
                logger.info('----------------------- COMPANY SYNC COMPLETED -----------------------');
                return [2 /*return*/];
        }
    });
}); };
var processCompanyBatch = function (apClient, hsClient, companyBatch, nextContext, metrics /*,
config: Config*/) { return __awaiter(void 0, void 0, void 0, function () {
    var apolloEnrichmentRequest, enrichedOrganizations, updatedHsCompanies, _i, companyBatch_1, hsCompany, updatedHsCompany, newPage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.debug("Processing a batch of HubSpot companies: ".concat(companiesForLogs(companyBatch)));
                apolloEnrichmentRequest = hsCompaniesToApEnrichmentRequest(companyBatch);
                return [4 /*yield*/, apClient.bulkEnrichOrganizations(apolloEnrichmentRequest)];
            case 1:
                enrichedOrganizations = _a.sent();
                if (!enrichedOrganizations) {
                    logger.error("Cannot update these HubSpot Companies without enriched organization information from Apollo.io: ".concat(companiesForLogs(companyBatch)));
                    metrics.incrementSyncMetrics('companySync', 'companies', 'error', companyBatch.length);
                    return [2 /*return*/];
                }
                updatedHsCompanies = [];
                for (_i = 0, companyBatch_1 = companyBatch; _i < companyBatch_1.length; _i++) {
                    hsCompany = companyBatch_1[_i];
                    try {
                        updatedHsCompany = enrichedApOrganizationsToUpdatedHsCompany(enrichedOrganizations, hsCompany);
                        updatedHsCompanies.push(updatedHsCompany);
                        metrics.incrementSyncMetrics('companySync', 'companies', 'success');
                    }
                    catch (error) {
                        logger.error("Error making HubSpot company update payload: ".concat(error));
                        metrics.incrementSyncMetrics('companySync', 'companies', 'error');
                    }
                }
                if (!updatedHsCompanies.length) return [3 /*break*/, 3];
                logger.debug("Updating HubSpot Companies: ".concat(companiesForLogs(updatedHsCompanies)));
                return [4 /*yield*/, hsClient.updateCompanies({ inputs: updatedHsCompanies })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                newPage = companyBatch.pop().page;
                nextContext.updateResourceContext('companies', 'page', newPage);
                return [2 /*return*/];
        }
    });
}); };
var companiesForLogs = function (companies) {
    return companies
        .map(function (company) {
        return company.properties.name
            ? "ID ".concat(company.id, ":").concat(company.properties.name)
            : "ID ".concat(company.id);
    })
        .join(', ');
};
