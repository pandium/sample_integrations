"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionActionDefinition = void 0;
class ExtensionActionDefinition {
    static getAttributeTypeMap() {
        return ExtensionActionDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExtensionActionDefinition = ExtensionActionDefinition;
ExtensionActionDefinition.discriminator = undefined;
ExtensionActionDefinition.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "revisionId",
        "baseName": "revisionId",
        "type": "string",
        "format": ""
    },
    {
        "name": "functions",
        "baseName": "functions",
        "type": "Array<ActionFunctionIdentifier>",
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
        "name": "archivedAt",
        "baseName": "archivedAt",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "inputFields",
        "baseName": "inputFields",
        "type": "Array<InputFieldDefinition>",
        "format": ""
    },
    {
        "name": "objectRequestOptions",
        "baseName": "objectRequestOptions",
        "type": "ObjectRequestOptions",
        "format": ""
    },
    {
        "name": "inputFieldDependencies",
        "baseName": "inputFieldDependencies",
        "type": "Array<ExtensionActionDefinitionPatchInputFieldDependenciesInner>",
        "format": ""
    },
    {
        "name": "labels",
        "baseName": "labels",
        "type": "{ [key: string]: ActionLabels; }",
        "format": ""
    },
    {
        "name": "objectTypes",
        "baseName": "objectTypes",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=ExtensionActionDefinition.js.map