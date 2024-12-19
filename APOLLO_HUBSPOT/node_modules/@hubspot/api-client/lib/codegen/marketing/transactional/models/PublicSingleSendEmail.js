"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSingleSendEmail = void 0;
class PublicSingleSendEmail {
    static getAttributeTypeMap() {
        return PublicSingleSendEmail.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicSingleSendEmail = PublicSingleSendEmail;
PublicSingleSendEmail.discriminator = undefined;
PublicSingleSendEmail.attributeTypeMap = [
    {
        "name": "_from",
        "baseName": "from",
        "type": "string",
        "format": ""
    },
    {
        "name": "to",
        "baseName": "to",
        "type": "string",
        "format": ""
    },
    {
        "name": "sendId",
        "baseName": "sendId",
        "type": "string",
        "format": ""
    },
    {
        "name": "replyTo",
        "baseName": "replyTo",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "cc",
        "baseName": "cc",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "bcc",
        "baseName": "bcc",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=PublicSingleSendEmail.js.map