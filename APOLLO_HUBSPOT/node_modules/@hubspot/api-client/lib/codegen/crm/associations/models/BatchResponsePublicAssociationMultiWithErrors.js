"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponsePublicAssociationMultiWithErrors = void 0;
class BatchResponsePublicAssociationMultiWithErrors {
    static getAttributeTypeMap() {
        return BatchResponsePublicAssociationMultiWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponsePublicAssociationMultiWithErrors = BatchResponsePublicAssociationMultiWithErrors;
BatchResponsePublicAssociationMultiWithErrors.discriminator = undefined;
BatchResponsePublicAssociationMultiWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponsePublicAssociationMultiWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicAssociationMulti>",
        "format": ""
    },
    {
        "name": "numErrors",
        "baseName": "numErrors",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "errors",
        "baseName": "errors",
        "type": "Array<StandardError>",
        "format": ""
    },
    {
        "name": "requestedAt",
        "baseName": "requestedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "startedAt",
        "baseName": "startedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "completedAt",
        "baseName": "completedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=BatchResponsePublicAssociationMultiWithErrors.js.map