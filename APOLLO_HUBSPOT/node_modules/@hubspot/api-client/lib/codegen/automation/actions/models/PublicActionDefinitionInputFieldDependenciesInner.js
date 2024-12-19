"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum = exports.PublicActionDefinitionInputFieldDependenciesInner = void 0;
class PublicActionDefinitionInputFieldDependenciesInner {
    static getAttributeTypeMap() {
        return PublicActionDefinitionInputFieldDependenciesInner.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicActionDefinitionInputFieldDependenciesInner = PublicActionDefinitionInputFieldDependenciesInner;
PublicActionDefinitionInputFieldDependenciesInner.discriminator = undefined;
PublicActionDefinitionInputFieldDependenciesInner.attributeTypeMap = [
    {
        "name": "dependencyType",
        "baseName": "dependencyType",
        "type": "PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum",
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
var PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum;
(function (PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum) {
    PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum["ConditionalSingleField"] = "CONDITIONAL_SINGLE_FIELD";
})(PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum = exports.PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum || (exports.PublicActionDefinitionInputFieldDependenciesInnerDependencyTypeEnum = {}));
//# sourceMappingURL=PublicActionDefinitionInputFieldDependenciesInner.js.map