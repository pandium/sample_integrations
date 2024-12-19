"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicExecutionTranslationRule = void 0;
class PublicExecutionTranslationRule {
    static getAttributeTypeMap() {
        return PublicExecutionTranslationRule.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicExecutionTranslationRule = PublicExecutionTranslationRule;
PublicExecutionTranslationRule.discriminator = undefined;
PublicExecutionTranslationRule.attributeTypeMap = [
    {
        "name": "labelName",
        "baseName": "labelName",
        "type": "string",
        "format": ""
    },
    {
        "name": "conditions",
        "baseName": "conditions",
        "type": "{ [key: string]: any; }",
        "format": ""
    }
];
//# sourceMappingURL=PublicExecutionTranslationRule.js.map