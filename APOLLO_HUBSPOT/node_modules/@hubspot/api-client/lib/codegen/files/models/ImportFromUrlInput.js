"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFromUrlInput = void 0;
class ImportFromUrlInput {
    static getAttributeTypeMap() {
        return ImportFromUrlInput.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ImportFromUrlInput = ImportFromUrlInput;
ImportFromUrlInput.discriminator = undefined;
ImportFromUrlInput.attributeTypeMap = [
    {
        "name": "access",
        "baseName": "access",
        "type": "ImportFromUrlInputAccessEnum",
        "format": ""
    },
    {
        "name": "ttl",
        "baseName": "ttl",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "folderId",
        "baseName": "folderId",
        "type": "string",
        "format": ""
    },
    {
        "name": "folderPath",
        "baseName": "folderPath",
        "type": "string",
        "format": ""
    },
    {
        "name": "duplicateValidationStrategy",
        "baseName": "duplicateValidationStrategy",
        "type": "ImportFromUrlInputDuplicateValidationStrategyEnum",
        "format": ""
    },
    {
        "name": "duplicateValidationScope",
        "baseName": "duplicateValidationScope",
        "type": "ImportFromUrlInputDuplicateValidationScopeEnum",
        "format": ""
    },
    {
        "name": "overwrite",
        "baseName": "overwrite",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=ImportFromUrlInput.js.map