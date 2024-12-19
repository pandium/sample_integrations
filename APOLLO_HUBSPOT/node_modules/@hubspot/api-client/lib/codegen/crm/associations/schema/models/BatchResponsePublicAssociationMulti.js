"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponsePublicAssociationMulti = void 0;
class BatchResponsePublicAssociationMulti {
    static getAttributeTypeMap() {
        return BatchResponsePublicAssociationMulti.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponsePublicAssociationMulti = BatchResponsePublicAssociationMulti;
BatchResponsePublicAssociationMulti.discriminator = undefined;
BatchResponsePublicAssociationMulti.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponsePublicAssociationMultiStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<PublicAssociationMulti>",
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
//# sourceMappingURL=BatchResponsePublicAssociationMulti.js.map