"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionActionDefinitionPatch = void 0;
class ExtensionActionDefinitionPatch {
    static getAttributeTypeMap() {
        return ExtensionActionDefinitionPatch.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExtensionActionDefinitionPatch = ExtensionActionDefinitionPatch;
ExtensionActionDefinitionPatch.discriminator = undefined;
ExtensionActionDefinitionPatch.attributeTypeMap = [
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
//# sourceMappingURL=ExtensionActionDefinitionPatch.js.map