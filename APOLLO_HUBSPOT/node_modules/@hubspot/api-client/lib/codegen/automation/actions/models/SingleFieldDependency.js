"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleFieldDependency = void 0;
class SingleFieldDependency {
    static getAttributeTypeMap() {
        return SingleFieldDependency.attributeTypeMap;
    }
    constructor() {
    }
}
exports.SingleFieldDependency = SingleFieldDependency;
SingleFieldDependency.discriminator = undefined;
SingleFieldDependency.attributeTypeMap = [
    {
        "name": "dependencyType",
        "baseName": "dependencyType",
        "type": "SingleFieldDependencyDependencyTypeEnum",
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
//# sourceMappingURL=SingleFieldDependency.js.map