"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachToLangPrimaryRequestVNext = void 0;
class AttachToLangPrimaryRequestVNext {
    static getAttributeTypeMap() {
        return AttachToLangPrimaryRequestVNext.attributeTypeMap;
    }
    constructor() {
    }
}
exports.AttachToLangPrimaryRequestVNext = AttachToLangPrimaryRequestVNext;
AttachToLangPrimaryRequestVNext.discriminator = undefined;
AttachToLangPrimaryRequestVNext.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "language",
        "baseName": "language",
        "type": "AttachToLangPrimaryRequestVNextLanguageEnum",
        "format": ""
    },
    {
        "name": "primaryId",
        "baseName": "primaryId",
        "type": "string",
        "format": ""
    },
    {
        "name": "primaryLanguage",
        "baseName": "primaryLanguage",
        "type": "AttachToLangPrimaryRequestVNextPrimaryLanguageEnum",
        "format": ""
    }
];
//# sourceMappingURL=AttachToLangPrimaryRequestVNext.js.map