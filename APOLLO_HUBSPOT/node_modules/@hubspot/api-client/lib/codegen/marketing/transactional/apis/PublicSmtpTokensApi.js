"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSmtpTokensApiResponseProcessor = exports.PublicSmtpTokensApiRequestFactory = void 0;
const baseapi_1 = require("./baseapi");
const http_1 = require("../http/http");
const ObjectSerializer_1 = require("../models/ObjectSerializer");
const exception_1 = require("./exception");
const util_1 = require("../util");
class PublicSmtpTokensApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    archiveToken(tokenId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (tokenId === null || tokenId === undefined) {
                throw new baseapi_1.RequiredError("PublicSmtpTokensApi", "archiveToken", "tokenId");
            }
            const localVarPath = '/marketing/v3/transactional/smtp-tokens/{tokenId}'
                .replace('{' + 'tokenId' + '}', encodeURIComponent(String(tokenId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    createToken(smtpApiTokenRequestEgg, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (smtpApiTokenRequestEgg === null || smtpApiTokenRequestEgg === undefined) {
                throw new baseapi_1.RequiredError("PublicSmtpTokensApi", "createToken", "smtpApiTokenRequestEgg");
            }
            const localVarPath = '/marketing/v3/transactional/smtp-tokens';
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(smtpApiTokenRequestEgg, "SmtpApiTokenRequestEgg", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    getTokenById(tokenId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (tokenId === null || tokenId === undefined) {
                throw new baseapi_1.RequiredError("PublicSmtpTokensApi", "getTokenById", "tokenId");
            }
            const localVarPath = '/marketing/v3/transactional/smtp-tokens/{tokenId}'
                .replace('{' + 'tokenId' + '}', encodeURIComponent(String(tokenId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    getTokensPage(campaignName, emailCampaignId, after, limit, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            const localVarPath = '/marketing/v3/transactional/smtp-tokens';
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            if (campaignName !== undefined) {
                requestContext.setQueryParam("campaignName", ObjectSerializer_1.ObjectSerializer.serialize(campaignName, "string", ""));
            }
            if (emailCampaignId !== undefined) {
                requestContext.setQueryParam("emailCampaignId", ObjectSerializer_1.ObjectSerializer.serialize(emailCampaignId, "string", ""));
            }
            if (after !== undefined) {
                requestContext.setQueryParam("after", ObjectSerializer_1.ObjectSerializer.serialize(after, "string", ""));
            }
            if (limit !== undefined) {
                requestContext.setQueryParam("limit", ObjectSerializer_1.ObjectSerializer.serialize(limit, "number", "int32"));
            }
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
    resetPassword(tokenId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (tokenId === null || tokenId === undefined) {
                throw new baseapi_1.RequiredError("PublicSmtpTokensApi", "resetPassword", "tokenId");
            }
            const localVarPath = '/marketing/v3/transactional/smtp-tokens/{tokenId}/password-reset'
                .replace('{' + 'tokenId' + '}', encodeURIComponent(String(tokenId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["oauth2"];
            if (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication) {
                yield (authMethod === null || authMethod === void 0 ? void 0 : authMethod.applySecurityAuthentication(requestContext));
            }
            const defaultAuth = ((_a = _options === null || _options === void 0 ? void 0 : _options.authMethods) === null || _a === void 0 ? void 0 : _a.default) || ((_c = (_b = this.configuration) === null || _b === void 0 ? void 0 : _b.authMethods) === null || _c === void 0 ? void 0 : _c.default);
            if (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication) {
                yield (defaultAuth === null || defaultAuth === void 0 ? void 0 : defaultAuth.applySecurityAuthentication(requestContext));
            }
            return requestContext;
        });
    }
}
exports.PublicSmtpTokensApiRequestFactory = PublicSmtpTokensApiRequestFactory;
class PublicSmtpTokensApiResponseProcessor {
    archiveToken(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("204", response.httpStatusCode)) {
                return;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "void", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    createToken(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "SmtpApiTokenView", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "SmtpApiTokenView", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getTokenById(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "SmtpApiTokenView", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "SmtpApiTokenView", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getTokensPage(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseSmtpApiTokenViewForwardPaging", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseSmtpApiTokenViewForwardPaging", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    resetPassword(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "SmtpApiTokenView", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "SmtpApiTokenView", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
}
exports.PublicSmtpTokensApiResponseProcessor = PublicSmtpTokensApiResponseProcessor;
//# sourceMappingURL=PublicSmtpTokensApi.js.map