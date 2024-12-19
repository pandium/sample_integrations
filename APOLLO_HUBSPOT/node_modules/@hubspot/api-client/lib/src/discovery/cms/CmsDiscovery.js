"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class CmsDiscovery extends BaseDiscovery_1.default {
    get auditLogs() {
        if (!this._auditLogs) {
            const requiredClass = require('./audit_logs/AuditLogsDiscovery');
            this._auditLogs = new requiredClass.default(this.config);
        }
        return this._auditLogs;
    }
    get blogs() {
        if (!this._blogs) {
            const requiredClass = require('./blogs/BlogsDiscovery');
            this._blogs = new requiredClass.default(this.config);
        }
        return this._blogs;
    }
    get domains() {
        if (!this._domains) {
            const requiredClass = require('./domains/DomainsDiscovery');
            this._domains = new requiredClass.default(this.config);
        }
        return this._domains;
    }
    get hubdb() {
        if (!this._hubdb) {
            const requiredClass = require('./hubdb/HubdbDiscovery');
            this._hubdb = new requiredClass.default(this.config);
        }
        return this._hubdb;
    }
    get pages() {
        if (!this._pages) {
            const requiredClass = require('./pages/PagesDiscovery');
            this._pages = new requiredClass.default(this.config);
        }
        return this._pages;
    }
    get performance() {
        if (!this._performance) {
            const requiredClass = require('./performance/PerformanceDiscovery');
            this._performance = new requiredClass.default(this.config);
        }
        return this._performance;
    }
    get siteSearch() {
        if (!this._siteSearch) {
            const requiredClass = require('./site_search/SiteSearchDiscovery');
            this._siteSearch = new requiredClass.default(this.config);
        }
        return this._siteSearch;
    }
    get sourceCode() {
        if (!this._sourceCode) {
            const requiredClass = require('./source_code/SourceCodeDiscovery');
            this._sourceCode = new requiredClass.default(this.config);
        }
        return this._sourceCode;
    }
    get urlRedirects() {
        if (!this._urlRedirects) {
            const requiredClass = require('./url_redirects/UrlRedirectsDiscovery');
            this._urlRedirects = new requiredClass.default(this.config);
        }
        return this._urlRedirects;
    }
}
exports.default = CmsDiscovery;
//# sourceMappingURL=CmsDiscovery.js.map