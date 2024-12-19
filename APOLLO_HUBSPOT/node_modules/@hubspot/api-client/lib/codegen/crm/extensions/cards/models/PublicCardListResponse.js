"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCardListResponse = void 0;
class PublicCardListResponse {
    static getAttributeTypeMap() {
        return PublicCardListResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicCardListResponse = PublicCardListResponse;
PublicCardListResponse.discriminator = undefined;
PublicCardListResponse.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicCardResponse>",
        "format": ""
    }
];
//# sourceMappingURL=PublicCardListResponse.js.map