"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubDbTableV3Request = void 0;
class HubDbTableV3Request {
    static getAttributeTypeMap() {
        return HubDbTableV3Request.attributeTypeMap;
    }
    constructor() {
    }
}
exports.HubDbTableV3Request = HubDbTableV3Request;
HubDbTableV3Request.discriminator = undefined;
HubDbTableV3Request.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
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
        "name": "useForPages",
        "baseName": "useForPages",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "allowPublicApiAccess",
        "baseName": "allowPublicApiAccess",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "allowChildTables",
        "baseName": "allowChildTables",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableChildTablePages",
        "baseName": "enableChildTablePages",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "columns",
        "baseName": "columns",
        "type": "Array<ColumnRequest>",
        "format": ""
    },
    {
        "name": "dynamicMetaTags",
        "baseName": "dynamicMetaTags",
        "type": "{ [key: string]: number; }",
        "format": "int32"
    }
];
//# sourceMappingURL=HubDbTableV3Request.js.map