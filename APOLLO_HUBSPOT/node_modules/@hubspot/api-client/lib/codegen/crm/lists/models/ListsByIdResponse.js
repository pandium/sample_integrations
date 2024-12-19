"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListsByIdResponse = void 0;
class ListsByIdResponse {
    static getAttributeTypeMap() {
        return ListsByIdResponse.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ListsByIdResponse = ListsByIdResponse;
ListsByIdResponse.discriminator = undefined;
ListsByIdResponse.attributeTypeMap = [
    {
        "name": "lists",
        "baseName": "lists",
        "type": "Array<PublicObjectList>",
        "format": ""
    }
];
//# sourceMappingURL=ListsByIdResponse.js.map