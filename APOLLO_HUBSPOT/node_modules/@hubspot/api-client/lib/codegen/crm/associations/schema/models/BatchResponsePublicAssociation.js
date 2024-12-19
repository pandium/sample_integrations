"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponsePublicAssociation = void 0;
class BatchResponsePublicAssociation {
    static getAttributeTypeMap() {
        return BatchResponsePublicAssociation.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponsePublicAssociation = BatchResponsePublicAssociation;
BatchResponsePublicAssociation.discriminator = undefined;
BatchResponsePublicAssociation.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponsePublicAssociationStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicAssociation>",
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
//# sourceMappingURL=BatchResponsePublicAssociation.js.map