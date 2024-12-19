"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionConfirmationBody = void 0;
class ActionConfirmationBody {
    static getAttributeTypeMap() {
        return ActionConfirmationBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionConfirmationBody = ActionConfirmationBody;
ActionConfirmationBody.discriminator = undefined;
ActionConfirmationBody.attributeTypeMap = [
    {
        "name": "prompt",
        "baseName": "prompt",
        "type": "string",
        "format": ""
    },
    {
        "name": "confirmButtonLabel",
        "baseName": "confirmButtonLabel",
        "type": "string",
        "format": ""
    },
    {
        "name": "cancelButtonLabel",
        "baseName": "cancelButtonLabel",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=ActionConfirmationBody.js.map