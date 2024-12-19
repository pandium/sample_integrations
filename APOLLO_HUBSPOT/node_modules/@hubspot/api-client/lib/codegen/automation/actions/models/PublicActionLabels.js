"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionLabels = void 0;
class PublicActionLabels {
    static getAttributeTypeMap() {
        return PublicActionLabels.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionLabels = PublicActionLabels;
PublicActionLabels.discriminator = undefined;
PublicActionLabels.attributeTypeMap = [
    {
        "name": "inputFieldDescriptions",
        "baseName": "inputFieldDescriptions",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "appDisplayName",
        "baseName": "appDisplayName",
        "type": "string",
        "format": ""
    },
    {
        "name": "outputFieldLabels",
        "baseName": "outputFieldLabels",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "inputFieldOptionLabels",
        "baseName": "inputFieldOptionLabels",
        "type": "{ [key: string]: { [key: string]: string; }; }",
        "format": ""
    },
    {
        "name": "actionDescription",
        "baseName": "actionDescription",
        "type": "string",
        "format": ""
    },
    {
        "name": "executionRules",
        "baseName": "executionRules",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "inputFieldLabels",
        "baseName": "inputFieldLabels",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "actionName",
        "baseName": "actionName",
        "type": "string",
        "format": ""
    },
    {
        "name": "actionCardContent",
        "baseName": "actionCardContent",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicActionLabels.js.map