"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegratorObjectResultActionsInner = void 0;
class IntegratorObjectResultActionsInner {
    static getAttributeTypeMap() {
        return IntegratorObjectResultActionsInner.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IntegratorObjectResultActionsInner = IntegratorObjectResultActionsInner;
IntegratorObjectResultActionsInner.discriminator = undefined;
IntegratorObjectResultActionsInner.attributeTypeMap = [
    {
        "name": "type",
        "baseName": "type",
        "type": "IntegratorObjectResultActionsInnerTypeEnum",
        "format": ""
    },
    {
        "name": "confirmation",
        "baseName": "confirmation",
        "type": "ActionConfirmationBody",
        "format": ""
    },
    {
        "name": "httpMethod",
        "baseName": "httpMethod",
        "type": "IntegratorObjectResultActionsInnerHttpMethodEnum",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "propertyNamesIncluded",
        "baseName": "propertyNamesIncluded",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "width",
        "baseName": "width",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "height",
        "baseName": "height",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=IntegratorObjectResultActionsInner.js.map