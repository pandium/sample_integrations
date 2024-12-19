"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnRequest = void 0;
class ColumnRequest {
    static getAttributeTypeMap() {
        return ColumnRequest.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ColumnRequest = ColumnRequest;
ColumnRequest.discriminator = undefined;
ColumnRequest.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "label",
        "baseName": "label",
        "type": "string",
        "format": ""
    },
    {
        "name": "type",
        "baseName": "type",
        "type": "ColumnRequestTypeEnum",
        "format": ""
    },
    {
        "name": "options",
        "baseName": "options",
        "type": "Array<Option>",
        "format": ""
    },
    {
        "name": "foreignTableId",
        "baseName": "foreignTableId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "foreignColumnId",
        "baseName": "foreignColumnId",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=ColumnRequest.js.map