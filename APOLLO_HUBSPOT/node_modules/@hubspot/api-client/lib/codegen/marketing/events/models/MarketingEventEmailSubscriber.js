"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingEventEmailSubscriber = void 0;
class MarketingEventEmailSubscriber {
    static getAttributeTypeMap() {
        return MarketingEventEmailSubscriber.attributeTypeMap;
    }
    constructor() {
    }
}
exports.MarketingEventEmailSubscriber = MarketingEventEmailSubscriber;
MarketingEventEmailSubscriber.discriminator = undefined;
MarketingEventEmailSubscriber.attributeTypeMap = [
    {
        "name": "contactProperties",
        "baseName": "contactProperties",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "properties",
        "baseName": "properties",
        "type": "{ [key: string]: string; }",
        "format": ""
    },
    {
        "name": "email",
        "baseName": "email",
        "type": "string",
        "format": ""
    },
    {
        "name": "interactionDateTime",
        "baseName": "interactionDateTime",
        "type": "number",
        "format": "int64"
    }
];
//# sourceMappingURL=MarketingEventEmailSubscriber.js.map