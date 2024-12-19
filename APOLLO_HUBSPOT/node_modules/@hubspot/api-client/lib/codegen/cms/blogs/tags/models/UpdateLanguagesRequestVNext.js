"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLanguagesRequestVNext = void 0;
class UpdateLanguagesRequestVNext {
    static getAttributeTypeMap() {
        return UpdateLanguagesRequestVNext.attributeTypeMap;
    }
    constructor() {
    }
}
exports.UpdateLanguagesRequestVNext = UpdateLanguagesRequestVNext;
UpdateLanguagesRequestVNext.discriminator = undefined;
UpdateLanguagesRequestVNext.attributeTypeMap = [
    {
        "name": "primaryId",
        "baseName": "primaryId",
        "type": "string",
        "format": ""
    },
    {
        "name": "languages",
        "baseName": "languages",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=UpdateLanguagesRequestVNext.js.map