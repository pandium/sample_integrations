"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingEventCompleteRequestParams = void 0;
class MarketingEventCompleteRequestParams {
    static getAttributeTypeMap() {
        return MarketingEventCompleteRequestParams.attributeTypeMap;
    }
    constructor() {
    }
}
exports.MarketingEventCompleteRequestParams = MarketingEventCompleteRequestParams;
MarketingEventCompleteRequestParams.discriminator = undefined;
MarketingEventCompleteRequestParams.attributeTypeMap = [
    {
        "name": "startDateTime",
        "baseName": "startDateTime",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "endDateTime",
        "baseName": "endDateTime",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=MarketingEventCompleteRequestParams.js.map