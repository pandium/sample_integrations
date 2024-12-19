"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionActionDefinitionInput = void 0;
class ExtensionActionDefinitionInput {
    static getAttributeTypeMap() {
        return ExtensionActionDefinitionInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExtensionActionDefinitionInput = ExtensionActionDefinitionInput;
ExtensionActionDefinitionInput.discriminator = undefined;
ExtensionActionDefinitionInput.attributeTypeMap = [
    {
        "name": "functions",
        "baseName": "functions",
        "type": "Array<ActionFunction>",
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
//# sourceMappingURL=ExtensionActionDefinitionInput.js.map