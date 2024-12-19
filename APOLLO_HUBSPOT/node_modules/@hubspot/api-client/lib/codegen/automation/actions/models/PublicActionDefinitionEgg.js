"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionDefinitionEgg = void 0;
class PublicActionDefinitionEgg {
    static getAttributeTypeMap() {
        return PublicActionDefinitionEgg.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionDefinitionEgg = PublicActionDefinitionEgg;
PublicActionDefinitionEgg.discriminator = undefined;
PublicActionDefinitionEgg.attributeTypeMap = [
    {
        "name": "inputFields",
        "baseName": "inputFields",
        "type": "Array<InputFieldDefinition>",
        "format": ""
    },
    {
        "name": "outputFields",
        "baseName": "outputFields",
        "type": "Array<OutputFieldDefinition>",
        "format": ""
    },
    {
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "functions",
        "baseName": "functions",
        "type": "Array<PublicActionFunction>",
        "format": ""
    },
    {
        "name": "actionUrl",
        "baseName": "actionUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "inputFieldDependencies",
        "baseName": "inputFieldDependencies",
        "type": "Array<PublicActionDefinitionInputFieldDependenciesInner>",
        "format": ""
    },
    {
        "name": "published",
        "baseName": "published",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "executionRules",
        "baseName": "executionRules",
        "type": "Array<PublicExecutionTranslationRule>",
        "format": ""
    },
    {
        "name": "objectTypes",
        "baseName": "objectTypes",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "objectRequestOptions",
        "baseName": "objectRequestOptions",
        "type": "PublicObjectRequestOptions",
        "format": ""
    },
    {
        "name": "labels",
        "baseName": "labels",
        "type": "{ [key: string]: PublicActionLabels; }",
        "format": ""
    }
];
//# sourceMappingURL=PublicActionDefinitionEgg.js.map