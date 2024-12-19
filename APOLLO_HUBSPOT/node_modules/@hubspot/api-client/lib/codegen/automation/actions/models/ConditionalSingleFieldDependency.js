"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalSingleFieldDependency = void 0;
class ConditionalSingleFieldDependency {
    static getAttributeTypeMap() {
        return ConditionalSingleFieldDependency.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ConditionalSingleFieldDependency = ConditionalSingleFieldDependency;
ConditionalSingleFieldDependency.discriminator = undefined;
ConditionalSingleFieldDependency.attributeTypeMap = [
    {
        "name": "dependencyType",
        "baseName": "dependencyType",
        "type": "ConditionalSingleFieldDependencyDependencyTypeEnum",
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
//# sourceMappingURL=ConditionalSingleFieldDependency.js.map