"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleStage = void 0;
class LifecycleStage {
    static getAttributeTypeMap() {
        return LifecycleStage.attributeTypeMap;
    }
    constructor() {
    }
}
exports.LifecycleStage = LifecycleStage;
LifecycleStage.discriminator = undefined;
LifecycleStage.attributeTypeMap = [
    {
        "name": "objectTypeId",
        "baseName": "objectTypeId",
        "type": "string",
        "format": ""
    },
    {
        "name": "value",
        "baseName": "value",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=LifecycleStage.js.map