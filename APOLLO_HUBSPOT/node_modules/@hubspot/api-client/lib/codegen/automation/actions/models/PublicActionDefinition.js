"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionDefinition = void 0;
class PublicActionDefinition {
    static getAttributeTypeMap() {
        return PublicActionDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionDefinition = PublicActionDefinition;
PublicActionDefinition.discriminator = undefined;
PublicActionDefinition.attributeTypeMap = [
    {
        "name": "functions",
        "baseName": "functions",
        "type": "Array<PublicActionFunctionIdentifier>",
        "format": ""
    },
    {
        "name": "actionUrl",
        "baseName": "actionUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "published",
        "baseName": "published",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "labels",
        "baseName": "labels",
        "type": "{ [key: string]: PublicActionLabels; }",
        "format": ""
    },
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
        "name": "revisionId",
        "baseName": "revisionId",
        "type": "string",
        "format": ""
    },
    {
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "inputFieldDependencies",
        "baseName": "inputFieldDependencies",
        "type": "Array<PublicActionDefinitionInputFieldDependenciesInner>",
        "format": ""
    },
    {
        "name": "executionRules",
        "baseName": "executionRules",
        "type": "Array<PublicExecutionTranslationRule>",
        "format": ""
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
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
    }
];
//# sourceMappingURL=PublicActionDefinition.js.map