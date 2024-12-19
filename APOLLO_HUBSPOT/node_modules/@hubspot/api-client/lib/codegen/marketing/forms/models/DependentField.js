"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependentField = void 0;
class DependentField {
    static getAttributeTypeMap() {
        return DependentField.attributeTypeMap;
    }
    constructor() {
    }
}
exports.DependentField = DependentField;
DependentField.discriminator = undefined;
DependentField.attributeTypeMap = [
    {
        "name": "dependentCondition",
        "baseName": "dependentCondition",
        "type": "DependentFieldFilter",
        "format": ""
    },
    {
        "name": "dependentField",
        "baseName": "dependentField",
        "type": "DependentFieldDependentField",
        "format": ""
    }
];
//# sourceMappingURL=DependentField.js.map