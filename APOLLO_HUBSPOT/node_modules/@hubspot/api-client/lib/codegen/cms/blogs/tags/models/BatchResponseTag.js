"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchResponseTag = void 0;
class BatchResponseTag {
    static getAttributeTypeMap() {
        return BatchResponseTag.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BatchResponseTag = BatchResponseTag;
BatchResponseTag.discriminator = undefined;
BatchResponseTag.attributeTypeMap = [
    {
        "name": "status",
        "baseName": "status",
        "type": "BatchResponseTagStatusEnum",
        "format": ""
    },
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<Tag>",
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
//# sourceMappingURL=BatchResponseTag.js.map