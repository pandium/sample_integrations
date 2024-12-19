"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionFunctionFunctionTypeEnum = exports.PublicActionFunction = void 0;
class PublicActionFunction {
    static getAttributeTypeMap() {
        return PublicActionFunction.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionFunction = PublicActionFunction;
PublicActionFunction.discriminator = undefined;
PublicActionFunction.attributeTypeMap = [
    {
        "name": "functionSource",
        "baseName": "functionSource",
        "type": "string",
        "format": ""
    },
    {
        "name": "functionType",
        "baseName": "functionType",
        "type": "PublicActionFunctionFunctionTypeEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
var PublicActionFunctionFunctionTypeEnum;
(function (PublicActionFunctionFunctionTypeEnum) {
    PublicActionFunctionFunctionTypeEnum["PreActionExecution"] = "PRE_ACTION_EXECUTION";
    PublicActionFunctionFunctionTypeEnum["PreFetchOptions"] = "PRE_FETCH_OPTIONS";
    PublicActionFunctionFunctionTypeEnum["PostFetchOptions"] = "POST_FETCH_OPTIONS";
    PublicActionFunctionFunctionTypeEnum["PostActionExecution"] = "POST_ACTION_EXECUTION";
})(PublicActionFunctionFunctionTypeEnum = exports.PublicActionFunctionFunctionTypeEnum || (exports.PublicActionFunctionFunctionTypeEnum = {}));
//# sourceMappingURL=PublicActionFunction.js.map