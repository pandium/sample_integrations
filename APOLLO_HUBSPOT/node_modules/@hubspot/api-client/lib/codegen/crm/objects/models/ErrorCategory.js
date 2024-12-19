"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCategory = void 0;
class ErrorCategory {
    static getAttributeTypeMap() {
        return ErrorCategory.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ErrorCategory = ErrorCategory;
ErrorCategory.discriminator = undefined;
ErrorCategory.attributeTypeMap = [
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "httpStatus",
        "baseName": "httpStatus",
        "type": "ErrorCategoryHttpStatusEnum",
        "format": ""
    }
];
//# sourceMappingURL=ErrorCategory.js.map