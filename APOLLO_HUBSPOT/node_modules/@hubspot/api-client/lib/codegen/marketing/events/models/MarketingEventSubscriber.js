"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingEventSubscriber = void 0;
class MarketingEventSubscriber {
    static getAttributeTypeMap() {
        return MarketingEventSubscriber.attributeTypeMap;
    }
    constructor() {
    }
}
exports.MarketingEventSubscriber = MarketingEventSubscriber;
MarketingEventSubscriber.discriminator = undefined;
MarketingEventSubscriber.attributeTypeMap = [
    {
        "name": "vid",
        "baseName": "vid",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "interactionDateTime",
        "baseName": "interactionDateTime",
        "type": "number",
        "format": "int64"
    }
];
//# sourceMappingURL=MarketingEventSubscriber.js.map