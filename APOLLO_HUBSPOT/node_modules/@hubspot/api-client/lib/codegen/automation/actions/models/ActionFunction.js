"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionFunction = void 0;
class ActionFunction {
    static getAttributeTypeMap() {
        return ActionFunction.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionFunction = ActionFunction;
ActionFunction.discriminator = undefined;
ActionFunction.attributeTypeMap = [
    {
        "name": "functionSource",
        "baseName": "functionSource",
        "type": "string",
        "format": ""
    },
    {
        "name": "functionType",
        "baseName": "functionType",
        "type": "ActionFunctionFunctionTypeEnum",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ActionFunction.js.map