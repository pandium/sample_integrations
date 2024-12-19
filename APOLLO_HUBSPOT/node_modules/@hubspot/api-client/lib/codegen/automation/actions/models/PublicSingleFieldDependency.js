"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSingleFieldDependencyDependencyTypeEnum = exports.PublicSingleFieldDependency = void 0;
class PublicSingleFieldDependency {
    static getAttributeTypeMap() {
        return PublicSingleFieldDependency.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PublicSingleFieldDependency = PublicSingleFieldDependency;
PublicSingleFieldDependency.discriminator = undefined;
PublicSingleFieldDependency.attributeTypeMap = [
    {
        "name": "dependencyType",
        "baseName": "dependencyType",
        "type": "PublicSingleFieldDependencyDependencyTypeEnum",
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
    }
];
var PublicSingleFieldDependencyDependencyTypeEnum;
(function (PublicSingleFieldDependencyDependencyTypeEnum) {
    PublicSingleFieldDependencyDependencyTypeEnum["SingleField"] = "SINGLE_FIELD";
})(PublicSingleFieldDependencyDependencyTypeEnum = exports.PublicSingleFieldDependencyDependencyTypeEnum || (exports.PublicSingleFieldDependencyDependencyTypeEnum = {}));
//# sourceMappingURL=PublicSingleFieldDependency.js.map