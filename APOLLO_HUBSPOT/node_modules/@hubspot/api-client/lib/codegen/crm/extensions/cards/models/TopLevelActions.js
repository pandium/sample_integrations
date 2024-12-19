"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopLevelActions = void 0;
class TopLevelActions {
    static getAttributeTypeMap() {
        return TopLevelActions.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TopLevelActions = TopLevelActions;
TopLevelActions.discriminator = undefined;
TopLevelActions.attributeTypeMap = [
    {
        "name": "settings",
        "baseName": "settings",
        "type": "IFrameActionBody",
        "format": ""
    },
    {
        "name": "primary",
        "baseName": "primary",
        "type": "IntegratorObjectResultActionsInner",
        "format": ""
    },
    {
        "name": "secondary",
        "baseName": "secondary",
        "type": "Array<IntegratorObjectResultActionsInner>",
        "format": ""
    }
];
//# sourceMappingURL=TopLevelActions.js.map