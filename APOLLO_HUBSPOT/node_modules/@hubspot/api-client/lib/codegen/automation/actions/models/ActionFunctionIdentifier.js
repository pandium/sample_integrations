"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionFunctionIdentifier = void 0;
class ActionFunctionIdentifier {
    static getAttributeTypeMap() {
        return ActionFunctionIdentifier.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionFunctionIdentifier = ActionFunctionIdentifier;
ActionFunctionIdentifier.discriminator = undefined;
ActionFunctionIdentifier.attributeTypeMap = [
    {
        "name": "functionType",
        "baseName": "functionType",
        "type": "ActionFunctionIdentifierFunctionTypeEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ActionFunctionIdentifier.js.map