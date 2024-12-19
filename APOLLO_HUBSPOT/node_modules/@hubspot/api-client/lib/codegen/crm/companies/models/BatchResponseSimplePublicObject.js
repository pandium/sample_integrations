"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseSimplePublicObject = void 0;
class BatchResponseSimplePublicObject {
    static getAttributeTypeMap() {
        return BatchResponseSimplePublicObject.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseSimplePublicObject = BatchResponseSimplePublicObject;
BatchResponseSimplePublicObject.discriminator = undefined;
BatchResponseSimplePublicObject.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseSimplePublicObjectStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SimplePublicObject>",
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
//# sourceMappingURL=BatchResponseSimplePublicObject.js.map