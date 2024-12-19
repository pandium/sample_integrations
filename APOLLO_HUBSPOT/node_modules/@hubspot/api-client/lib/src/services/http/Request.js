"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const ApiClientConfigurator_1 = require("../../configuration/ApiClientConfigurator");
const Auth_1 = require("./Auth");
const AuthMethods_1 = require("./AuthMethods");
const AuthTypes_1 = require("./AuthTypes");
class Request {
    constructor(config = {}, opts = {}) {
        this.baseUrl = 'https://api.hubapi.com';
        this.headers = {};
        this.config = config;
        this.opts = opts;
        if (config.basePath) {
            this.baseUrl = config.basePath;
        }
        this.url = this.generateUrl();
        this.method = this.opts.method || 'GET';
        this.initHeaders();
        this.applyAuth();
        this.setBody();
    }
    getSendData() {
        let sendData = {
            method: this.method,
            headers: this.headers,
        };
        if (this.body) {
            sendData = Object.assign(sendData, { body: this.body });
        }
        return sendData;
    }
    getUrl() {
        return this.url;
    }
    applyAuth() {
        const authType = Auth_1.Auth.chooseAuth(this.opts, this.config);
        if (authType) {
            const method = (0, lodash_get_1.default)(AuthTypes_1.AuthTypes, authType);
            const value = (0, lodash_get_1.default)(this.config, authType);
            if (method === AuthMethods_1.AuthMethods.hapikey) {
                this.url.searchParams.set('hapikey', value);
            }
            if (method === AuthMethods_1.AuthMethods.accessToken) {
                this.headers = Object.assign(this.headers, { Authorization: `Bearer ${value}` });
            }
        }
    }
    initHeaders() {
        if ((0, lodash_get_1.default)(this.opts, 'defaultJson', true)) {
            this.headers = { 'Content-Type': 'application/json' };
        }
        this.headers = Object.assign(this.headers, this.config.defaultHeaders, this.getDefaultHeaders(), this.opts.headers);
    }
    getDefaultHeaders() {
        return {
            Accept: 'application/json, */*;q=0.8',
            'User-agent': ApiClientConfigurator_1.ApiClientConfigurator.getUserAgent(),
        };
    }
    generateUrl() {
        let urlStr = this.opts.overlapUrl || this.baseUrl + (this.opts.path || '');
        if (this.opts.qs) {
            const params = new URLSearchParams(this.opts.qs);
            urlStr = `${urlStr}?${params}`;
        }
        return new URL(urlStr);
    }
    setBody() {
        if (this.opts.body) {
            this.body = this.opts.body;
            if ((0, lodash_get_1.default)(this.headers, 'Content-Type') === 'application/json' && (0, lodash_get_1.default)(this.opts, 'defaultJson', true)) {
                this.body = JSON.stringify(this.body);
            }
        }
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map