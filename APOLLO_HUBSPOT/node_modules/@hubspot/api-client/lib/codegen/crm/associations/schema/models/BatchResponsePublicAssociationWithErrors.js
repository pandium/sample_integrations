"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponsePublicAssociationWithErrors = void 0;
class BatchResponsePublicAssociationWithErrors {
    static getAttributeTypeMap() {
        return BatchResponsePublicAssociationWithErrors.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponsePublicAssociationWithErrors = BatchResponsePublicAssociationWithErrors;
BatchResponsePublicAssociationWithErrors.discriminator = undefined;
BatchResponsePublicAssociationWithErrors.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponsePublicAssociationWithErrorsStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicAssociation>",
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
//# sourceMappingURL=BatchResponsePublicAssociationWithErrors.js.map