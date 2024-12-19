"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionLabels = void 0;
class ActionLabels {
    static getAttributeTypeMap() {
        return ActionLabels.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionLabels = ActionLabels;
ActionLabels.discriminator = undefined;
ActionLabels.attributeTypeMap = [
    {
        "name": "inputFieldLabels",
        "baseName": "inputFieldLabels",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "inputFieldDescriptions",
        "baseName": "inputFieldDescriptions",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "actionName",
        "baseName": "actionName",
        "type": "string",
        "format": ""
    },
    {
        "name": "actionDescription",
        "baseName": "actionDescription",
        "type": "string",
        "format": ""
    },
    {
        "name": "appDisplayName",
        "baseName": "appDisplayName",
        "type": "string",
        "format": ""
    },
    {
        "name": "actionCardContent",
        "baseName": "actionCardContent",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ActionLabels.js.map