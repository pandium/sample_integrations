"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceView = void 0;
class PerformanceView {
    static getAttributeTypeMap() {
        return PerformanceView.attributeTypeMap;
    }
    constructor() {
    }
}
exports.PerformanceView = PerformanceView;
PerformanceView.discriminator = undefined;
PerformanceView.attributeTypeMap = [
    {
        "name": "_403",
        "baseName": "403",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_404",
        "baseName": "404",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_500",
        "baseName": "500",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_504",
        "baseName": "504",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "startTimestamp",
        "baseName": "startTimestamp",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "endTimestamp",
        "baseName": "endTimestamp",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "startDatetime",
        "baseName": "startDatetime",
        "type": "string",
        "format": ""
    },
    {
        "name": "endDatetime",
        "baseName": "endDatetime",
        "type": "string",
        "format": ""
    },
    {
        "name": "totalRequests",
        "baseName": "totalRequests",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "cacheHits",
        "baseName": "cacheHits",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "cacheHitRate",
        "baseName": "cacheHitRate",
        "type": "number",
        "format": ""
    },
    {
        "name": "totalRequestTime",
        "baseName": "totalRequestTime",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "avgOriginResponseTime",
        "baseName": "avgOriginResponseTime",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "responseTimeMs",
        "baseName": "responseTimeMs",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_100x",
        "baseName": "100X",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_20x",
        "baseName": "20X",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_30x",
        "baseName": "30X",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_40x",
        "baseName": "40X",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_50x",
        "baseName": "50X",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_50th",
        "baseName": "50th",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_95th",
        "baseName": "95th",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "_99th",
        "baseName": "99th",
        "type": "number",
        "format": "int32"
    }
];
//# sourceMappingURL=PerformanceView.js.map