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
exports.TemplatesApiResponseProcessor = exports.TemplatesApiRequestFactory = void 0;
const baseapi_1 = require("./baseapi");
const http_1 = require("../http/http");
const ObjectSerializer_1 = require("../models/ObjectSerializer");
const exception_1 = require("./exception");
const util_1 = require("../util");
class TemplatesApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    archive(eventTemplateId, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (eventTemplateId === null || eventTemplateId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "archive", "eventTemplateId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "archive", "appId");
            }
            const localVarPath = '/crm/v3/timeline/{appId}/event-templates/{eventTemplateId}'
                .replace('{' + 'eventTemplateId' + '}', encodeURIComponent(String(eventTemplateId)))
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.DELETE);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["developer_hapikey"];
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
    create(appId, timelineEventTemplateCreateRequest, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "create", "appId");
            }
            if (timelineEventTemplateCreateRequest === null || timelineEventTemplateCreateRequest === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "create", "timelineEventTemplateCreateRequest");
            }
            const localVarPath = '/crm/v3/timeline/{appId}/event-templates'
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.POST);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(timelineEventTemplateCreateRequest, "TimelineEventTemplateCreateRequest", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod;
            authMethod = _config.authMethods["developer_hapikey"];
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
    getAll(appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "getAll", "appId");
            }
            const localVarPath = '/crm/v3/timeline/{appId}/event-templates'
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["developer_hapikey"];
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
    getById(eventTemplateId, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (eventTemplateId === null || eventTemplateId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "getById", "eventTemplateId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "getById", "appId");
            }
            const localVarPath = '/crm/v3/timeline/{appId}/event-templates/{eventTemplateId}'
                .replace('{' + 'eventTemplateId' + '}', encodeURIComponent(String(eventTemplateId)))
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.GET);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            let authMethod;
            authMethod = _config.authMethods["developer_hapikey"];
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
    update(eventTemplateId, appId, timelineEventTemplateUpdateRequest, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (eventTemplateId === null || eventTemplateId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "update", "eventTemplateId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "update", "appId");
            }
            if (timelineEventTemplateUpdateRequest === null || timelineEventTemplateUpdateRequest === undefined) {
                throw new baseapi_1.RequiredError("TemplatesApi", "update", "timelineEventTemplateUpdateRequest");
            }
            const localVarPath = '/crm/v3/timeline/{appId}/event-templates/{eventTemplateId}'
                .replace('{' + 'eventTemplateId' + '}', encodeURIComponent(String(eventTemplateId)))
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "application/json"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(timelineEventTemplateUpdateRequest, "TimelineEventTemplateUpdateRequest", ""), contentType);
            requestContext.setBody(serializedBody);
            let authMethod;
            authMethod = _config.authMethods["developer_hapikey"];
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
exports.TemplatesApiRequestFactory = TemplatesApiRequestFactory;
class TemplatesApiResponseProcessor {
    archive(response) {
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
    create(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("201", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "TimelineEventTemplate", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "TimelineEventTemplate", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getAll(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseTimelineEventTemplateNoPaging", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseTimelineEventTemplateNoPaging", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getById(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "TimelineEventTemplate", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "TimelineEventTemplate", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    update(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "TimelineEventTemplate", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "TimelineEventTemplate", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
}
exports.TemplatesApiResponseProcessor = TemplatesApiResponseProcessor;
//# sourceMappingURL=TemplatesApi.js.map