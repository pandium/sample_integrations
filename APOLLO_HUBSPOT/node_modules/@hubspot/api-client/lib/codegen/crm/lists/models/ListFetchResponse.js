"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListFetchResponse = void 0;
class ListFetchResponse {
    static getAttributeTypeMap() {
        return ListFetchResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ListFetchResponse = ListFetchResponse;
ListFetchResponse.discriminator = undefined;
ListFetchResponse.attributeTypeMap = [
    {
        "name": "list",
        "baseName": "list",
        "type": "PublicObjectList",
        "format": ""
    }
];
//# sourceMappingURL=ListFetchResponse.js.map