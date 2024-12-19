"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExtractRequest = void 0;
class FileExtractRequest {
    static getAttributeTypeMap() {
        return FileExtractRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.FileExtractRequest = FileExtractRequest;
FileExtractRequest.discriminator = undefined;
FileExtractRequest.attributeTypeMap = [
    {
        "name": "path",
        "baseName": "path",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=FileExtractRequest.js.map