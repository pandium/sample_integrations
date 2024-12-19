"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const AuditLogsDiscovery_1 = __importDefault(require("../../../src/discovery/cms/audit_logs/AuditLogsDiscovery"));
const BlogsDiscovery_1 = __importDefault(require("../../../src/discovery/cms/blogs/BlogsDiscovery"));
const DomainsDiscovery_1 = __importDefault(require("../../../src/discovery/cms/domains/DomainsDiscovery"));
const HubdbDiscovery_1 = __importDefault(require("../../../src/discovery/cms/hubdb/HubdbDiscovery"));
const PagesDiscovery_1 = __importDefault(require("../../../src/discovery/cms/pages/PagesDiscovery"));
const PerformanceDiscovery_1 = __importDefault(require("../../../src/discovery/cms/performance/PerformanceDiscovery"));
const SiteSearchDiscovery_1 = __importDefault(require("../../../src/discovery/cms/site_search/SiteSearchDiscovery"));
const SourceCodeDiscovery_1 = __importDefault(require("../../../src/discovery/cms/source_code/SourceCodeDiscovery"));
const UrlRedirectsDiscovery_1 = __importDefault(require("../../../src/discovery/cms/url_redirects/UrlRedirectsDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().cms;
        expect(AuditLogsDiscovery_1.default.name).toBe(client.auditLogs.constructor.name);
        expect(BlogsDiscovery_1.default.name).toBe(client.blogs.constructor.name);
        expect(DomainsDiscovery_1.default.name).toBe(client.domains.constructor.name);
        expect(HubdbDiscovery_1.default.name).toBe(client.hubdb.constructor.name);
        expect(PagesDiscovery_1.default.name).toBe(client.pages.constructor.name);
        expect(PerformanceDiscovery_1.default.name).toBe(client.performance.constructor.name);
        expect(SiteSearchDiscovery_1.default.name).toBe(client.siteSearch.constructor.name);
        expect(SourceCodeDiscovery_1.default.name).toBe(client.sourceCode.constructor.name);
        expect(UrlRedirectsDiscovery_1.default.name).toBe(client.urlRedirects.constructor.name);
    });
});
//# sourceMappingURL=cms.spec.js.map