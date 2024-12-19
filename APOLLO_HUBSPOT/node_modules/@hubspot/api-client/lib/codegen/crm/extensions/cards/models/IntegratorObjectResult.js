"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegratorObjectResult = void 0;
class IntegratorObjectResult {
    static getAttributeTypeMap() {
        return IntegratorObjectResult.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IntegratorObjectResult = IntegratorObjectResult;
IntegratorObjectResult.discriminator = undefined;
IntegratorObjectResult.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "title",
        "baseName": "title",
        "type": "string",
        "format": ""
    },
    {
        "name": "linkUrl",
        "baseName": "linkUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "tokens",
        "baseName": "tokens",
        "type": "Array<ObjectToken>",
        "format": ""
    },
    {
        "name": "actions",
        "baseName": "actions",
        "type": "Array<IntegratorObjectResultActionsInner>",
        "format": ""
    }
];
//# sourceMappingURL=IntegratorObjectResult.js.map