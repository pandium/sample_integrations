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
exports.FunctionsApiResponseProcessor = exports.FunctionsApiRequestFactory = void 0;
const baseapi_1 = require("./baseapi");
const http_1 = require("../http/http");
const ObjectSerializer_1 = require("../models/ObjectSerializer");
const exception_1 = require("./exception");
const util_1 = require("../util");
class FunctionsApiRequestFactory extends baseapi_1.BaseAPIRequestFactory {
    archive(definitionId, functionType, functionId, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archive", "definitionId");
            }
            if (functionType === null || functionType === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archive", "functionType");
            }
            if (functionId === null || functionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archive", "functionId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archive", "appId");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions/{functionType}/{functionId}'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
                .replace('{' + 'functionType' + '}', encodeURIComponent(String(functionType)))
                .replace('{' + 'functionId' + '}', encodeURIComponent(String(functionId)))
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
    archiveByFunctionType(definitionId, functionType, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archiveByFunctionType", "definitionId");
            }
            if (functionType === null || functionType === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archiveByFunctionType", "functionType");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "archiveByFunctionType", "appId");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions/{functionType}'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
                .replace('{' + 'functionType' + '}', encodeURIComponent(String(functionType)))
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
    createOrReplace(definitionId, functionType, functionId, appId, body, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplace", "definitionId");
            }
            if (functionType === null || functionType === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplace", "functionType");
            }
            if (functionId === null || functionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplace", "functionId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplace", "appId");
            }
            if (body === null || body === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplace", "body");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions/{functionType}/{functionId}'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
                .replace('{' + 'functionType' + '}', encodeURIComponent(String(functionType)))
                .replace('{' + 'functionId' + '}', encodeURIComponent(String(functionId)))
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "text/plain"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(body, "string", ""), contentType);
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
    createOrReplaceByFunctionType(definitionId, functionType, appId, body, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplaceByFunctionType", "definitionId");
            }
            if (functionType === null || functionType === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplaceByFunctionType", "functionType");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplaceByFunctionType", "appId");
            }
            if (body === null || body === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "createOrReplaceByFunctionType", "body");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions/{functionType}'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
                .replace('{' + 'functionType' + '}', encodeURIComponent(String(functionType)))
                .replace('{' + 'appId' + '}', encodeURIComponent(String(appId)));
            const requestContext = _config.baseServer.makeRequestContext(localVarPath, http_1.HttpMethod.PUT);
            requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8");
            const contentType = ObjectSerializer_1.ObjectSerializer.getPreferredMediaType([
                "text/plain"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
            const serializedBody = ObjectSerializer_1.ObjectSerializer.stringify(ObjectSerializer_1.ObjectSerializer.serialize(body, "string", ""), contentType);
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
    getByFunctionType(definitionId, functionType, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getByFunctionType", "definitionId");
            }
            if (functionType === null || functionType === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getByFunctionType", "functionType");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getByFunctionType", "appId");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions/{functionType}'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
                .replace('{' + 'functionType' + '}', encodeURIComponent(String(functionType)))
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
    getById(definitionId, functionType, functionId, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getById", "definitionId");
            }
            if (functionType === null || functionType === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getById", "functionType");
            }
            if (functionId === null || functionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getById", "functionId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getById", "appId");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions/{functionType}/{functionId}'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
                .replace('{' + 'functionType' + '}', encodeURIComponent(String(functionType)))
                .replace('{' + 'functionId' + '}', encodeURIComponent(String(functionId)))
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
    getPage(definitionId, appId, _options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let _config = _options || this.configuration;
            if (definitionId === null || definitionId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getPage", "definitionId");
            }
            if (appId === null || appId === undefined) {
                throw new baseapi_1.RequiredError("FunctionsApi", "getPage", "appId");
            }
            const localVarPath = '/automation/v4/actions/{appId}/{definitionId}/functions'
                .replace('{' + 'definitionId' + '}', encodeURIComponent(String(definitionId)))
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
}
exports.FunctionsApiRequestFactory = FunctionsApiRequestFactory;
class FunctionsApiResponseProcessor {
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
    archiveByFunctionType(response) {
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
    createOrReplace(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunctionIdentifier", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunctionIdentifier", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    createOrReplaceByFunctionType(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunctionIdentifier", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunctionIdentifier", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getByFunctionType(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunction", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunction", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getById(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunction", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "ActionFunction", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
    getPage(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentType = ObjectSerializer_1.ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
            if ((0, util_1.isCodeInRange)("200", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseActionFunctionIdentifierNoPaging", "");
                return body;
            }
            if ((0, util_1.isCodeInRange)("0", response.httpStatusCode)) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "Error", "");
                throw new exception_1.ApiException(response.httpStatusCode, "An error occurred.", body, response.headers);
            }
            if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
                const body = ObjectSerializer_1.ObjectSerializer.deserialize(ObjectSerializer_1.ObjectSerializer.parse(yield response.body.text(), contentType), "CollectionResponseActionFunctionIdentifierNoPaging", "");
                return body;
            }
            throw new exception_1.ApiException(response.httpStatusCode, "Unknown API Status Code!", yield response.getBodyAsAny(), response.headers);
        });
    }
}
exports.FunctionsApiResponseProcessor = FunctionsApiResponseProcessor;
//# sourceMappingURL=FunctionsApi.js.map