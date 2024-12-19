"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicConditionalSingleFieldDependencyDependencyTypeEnum = exports.PublicConditionalSingleFieldDependency = void 0;
class PublicConditionalSingleFieldDependency {
    static getAttributeTypeMap() {
        return PublicConditionalSingleFieldDependency.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicConditionalSingleFieldDependency = PublicConditionalSingleFieldDependency;
PublicConditionalSingleFieldDependency.discriminator = undefined;
PublicConditionalSingleFieldDependency.attributeTypeMap = [
    {
        "name": "dependencyType",
        "baseName": "dependencyType",
        "type": "PublicConditionalSingleFieldDependencyDependencyTypeEnum",
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
var PublicConditionalSingleFieldDependencyDependencyTypeEnum;
(function (PublicConditionalSingleFieldDependencyDependencyTypeEnum) {
    PublicConditionalSingleFieldDependencyDependencyTypeEnum["ConditionalSingleField"] = "CONDITIONAL_SINGLE_FIELD";
})(PublicConditionalSingleFieldDependencyDependencyTypeEnum = exports.PublicConditionalSingleFieldDependencyDependencyTypeEnum || (exports.PublicConditionalSingleFieldDependencyDependencyTypeEnum = {}));
//# sourceMappingURL=PublicConditionalSingleFieldDependency.js.map