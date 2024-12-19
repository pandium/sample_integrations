"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModificationMetadata = void 0;
class PropertyModificationMetadata {
    static getAttributeTypeMap() {
        return PropertyModificationMetadata.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PropertyModificationMetadata = PropertyModificationMetadata;
PropertyModificationMetadata.discriminator = undefined;
PropertyModificationMetadata.attributeTypeMap = [
    {
        "name": "archivable",
        "baseName": "archivable",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "readOnlyDefinition",
        "baseName": "readOnlyDefinition",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "readOnlyOptions",
        "baseName": "readOnlyOptions",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "readOnlyValue",
        "baseName": "readOnlyValue",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=PropertyModificationMetadata.js.map