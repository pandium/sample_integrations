"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionActionDefinitionPatchInputFieldDependenciesInner = void 0;
class ExtensionActionDefinitionPatchInputFieldDependenciesInner {
    static getAttributeTypeMap() {
        return ExtensionActionDefinitionPatchInputFieldDependenciesInner.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ExtensionActionDefinitionPatchInputFieldDependenciesInner = ExtensionActionDefinitionPatchInputFieldDependenciesInner;
ExtensionActionDefinitionPatchInputFieldDependenciesInner.discriminator = undefined;
ExtensionActionDefinitionPatchInputFieldDependenciesInner.attributeTypeMap = [
    {
        "name": "dependencyType",
        "baseName": "dependencyType",
        "type": "ExtensionActionDefinitionPatchInputFieldDependenciesInnerDependencyTypeEnum",
        "format": ""
    },
    {
        "name": "dependentFieldNames",
        "baseName": "dependentFieldNames",
        "type": "Array<string>",
        "format": ""
    },
    {
        "name": "controllingFieldName",
        "baseName": "controllingFieldName",
        "type": "string",
        "format": ""
    },
    {
        "name": "controllingFieldValue",
        "baseName": "controllingFieldValue",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ExtensionActionDefinitionPatchInputFieldDependenciesInner.js.map