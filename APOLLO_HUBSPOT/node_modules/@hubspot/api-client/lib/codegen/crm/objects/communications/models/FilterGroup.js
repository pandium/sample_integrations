"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterGroup = void 0;
class FilterGroup {
    static getAttributeTypeMap() {
        return FilterGroup.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FilterGroup = FilterGroup;
FilterGroup.discriminator = undefined;
FilterGroup.attributeTypeMap = [
    {
        "name": "filters",
        "baseName": "filters",
        "type": "Array<Filter>",
        "format": ""
    }
];
//# sourceMappingURL=FilterGroup.js.map