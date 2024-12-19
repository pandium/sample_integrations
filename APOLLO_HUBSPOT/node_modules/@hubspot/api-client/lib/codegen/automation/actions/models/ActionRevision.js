"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRevision = void 0;
class ActionRevision {
    static getAttributeTypeMap() {
        return ActionRevision.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionRevision = ActionRevision;
ActionRevision.discriminator = undefined;
ActionRevision.attributeTypeMap = [
    {
        "name": "definition",
        "baseName": "definition",
        "type": "ExtensionActionDefinition",
        "format": ""
    },
    {
        "name": "createdAt",
        "baseName": "createdAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "revisionId",
        "baseName": "revisionId",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ActionRevision.js.map