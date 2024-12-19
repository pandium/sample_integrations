"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionDefinitionPatch = void 0;
class PublicActionDefinitionPatch {
    static getAttributeTypeMap() {
        return PublicActionDefinitionPatch.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionDefinitionPatch = PublicActionDefinitionPatch;
PublicActionDefinitionPatch.discriminator = undefined;
PublicActionDefinitionPatch.attributeTypeMap = [
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
//# sourceMappingURL=PublicActionDefinitionPatch.js.map