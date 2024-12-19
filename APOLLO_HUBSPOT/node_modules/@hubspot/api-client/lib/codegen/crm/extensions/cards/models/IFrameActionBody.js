"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFrameActionBody = void 0;
class IFrameActionBody {
    static getAttributeTypeMap() {
        return IFrameActionBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.IFrameActionBody = IFrameActionBody;
IFrameActionBody.discriminator = undefined;
IFrameActionBody.attributeTypeMap = [
    {
        "name": "type",
        "baseName": "type",
        "type": "IFrameActionBodyTypeEnum",
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
    }
];
//# sourceMappingURL=IFrameActionBody.js.map