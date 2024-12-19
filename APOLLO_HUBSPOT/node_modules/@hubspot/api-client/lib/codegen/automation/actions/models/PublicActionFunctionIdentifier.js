"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionFunctionIdentifierFunctionTypeEnum = exports.PublicActionFunctionIdentifier = void 0;
class PublicActionFunctionIdentifier {
    static getAttributeTypeMap() {
        return PublicActionFunctionIdentifier.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionFunctionIdentifier = PublicActionFunctionIdentifier;
PublicActionFunctionIdentifier.discriminator = undefined;
PublicActionFunctionIdentifier.attributeTypeMap = [
    {
        "name": "functionType",
        "baseName": "functionType",
        "type": "PublicActionFunctionIdentifierFunctionTypeEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
var PublicActionFunctionIdentifierFunctionTypeEnum;
(function (PublicActionFunctionIdentifierFunctionTypeEnum) {
    PublicActionFunctionIdentifierFunctionTypeEnum["PreActionExecution"] = "PRE_ACTION_EXECUTION";
    PublicActionFunctionIdentifierFunctionTypeEnum["PreFetchOptions"] = "PRE_FETCH_OPTIONS";
    PublicActionFunctionIdentifierFunctionTypeEnum["PostFetchOptions"] = "POST_FETCH_OPTIONS";
    PublicActionFunctionIdentifierFunctionTypeEnum["PostActionExecution"] = "POST_ACTION_EXECUTION";
})(PublicActionFunctionIdentifierFunctionTypeEnum = exports.PublicActionFunctionIdentifierFunctionTypeEnum || (exports.PublicActionFunctionIdentifierFunctionTypeEnum = {}));
//# sourceMappingURL=PublicActionFunctionIdentifier.js.map