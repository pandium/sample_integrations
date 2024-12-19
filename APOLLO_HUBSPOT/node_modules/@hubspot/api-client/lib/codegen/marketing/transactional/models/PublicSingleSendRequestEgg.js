"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSingleSendRequestEgg = void 0;
class PublicSingleSendRequestEgg {
    static getAttributeTypeMap() {
        return PublicSingleSendRequestEgg.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicSingleSendRequestEgg = PublicSingleSendRequestEgg;
PublicSingleSendRequestEgg.discriminator = undefined;
PublicSingleSendRequestEgg.attributeTypeMap = [
    {
        "name": "emailId",
        "baseName": "emailId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "message",
        "baseName": "message",
        "type": "PublicSingleSendEmail",
        "format": ""
    },
    {
        "name": "contactProperties",
        "baseName": "contactProperties",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "customProperties",
        "baseName": "customProperties",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
];
//# sourceMappingURL=PublicSingleSendRequestEgg.js.map