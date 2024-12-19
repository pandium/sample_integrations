"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOption = void 0;
class DisplayOption {
    static getAttributeTypeMap() {
        return DisplayOption.attributeTypeMap;
    }
    constructor() {
    }
}
exports.DisplayOption = DisplayOption;
DisplayOption.discriminator = undefined;
DisplayOption.attributeTypeMap = [
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
        "name": "type",
        "baseName": "type",
        "type": "DisplayOptionTypeEnum",
        "format": ""
    }
];
//# sourceMappingURL=DisplayOption.js.map