import { namespaceLogger } from '../libs/logger.js';
var logger = namespaceLogger('Company Sync');
export var hsCompaniesToApEnrichmentRequest = function (hsCompanies) {
    var domains = hsCompanies.map(function (company) { return company.properties.domain; });
    return {
        domains: domains,
    };
};
