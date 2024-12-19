"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCardFetchBody = void 0;
class PublicCardFetchBody {
    static getAttributeTypeMap() {
        return PublicCardFetchBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicCardFetchBody = PublicCardFetchBody;
PublicCardFetchBody.discriminator = undefined;
PublicCardFetchBody.attributeTypeMap = [
    {
        "name": "objectTypes",
        "baseName": "objectTypes",
        "type": "Array<CardObjectTypeBody>",
        "format": ""
    },
    {
        "name": "targetUrl",
        "baseName": "targetUrl",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=PublicCardFetchBody.js.map