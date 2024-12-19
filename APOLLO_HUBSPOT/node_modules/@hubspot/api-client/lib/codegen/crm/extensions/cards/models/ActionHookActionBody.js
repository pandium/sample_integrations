"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionHookActionBody = void 0;
class ActionHookActionBody {
    static getAttributeTypeMap() {
        return ActionHookActionBody.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ActionHookActionBody = ActionHookActionBody;
ActionHookActionBody.discriminator = undefined;
ActionHookActionBody.attributeTypeMap = [
    {
        "name": "type",
        "baseName": "type",
        "type": "ActionHookActionBodyTypeEnum",
        "format": ""
    },
    {
        "name": "confirmation",
        "baseName": "confirmation",
        "type": "ActionConfirmationBody",
        "format": ""
    },
    {
        "name": "httpMethod",
        "baseName": "httpMethod",
        "type": "ActionHookActionBodyHttpMethodEnum",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
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
        "name": "propertyNamesIncluded",
        "baseName": "propertyNamesIncluded",
        "type": "Array<string>",
        "format": ""
    }
];
//# sourceMappingURL=ActionHookActionBody.js.map