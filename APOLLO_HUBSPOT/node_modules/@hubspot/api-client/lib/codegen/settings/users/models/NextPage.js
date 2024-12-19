"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextPage = void 0;
class NextPage {
    static getAttributeTypeMap() {
        return NextPage.attributeTypeMap;
    }
    constructor() {
    }
}
exports.NextPage = NextPage;
NextPage.discriminator = undefined;
NextPage.attributeTypeMap = [
    {
        "name": "link",
        "baseName": "link",
        "type": "string",
        "format": ""
    },
    {
        "name": "after",
        "baseName": "after",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=NextPage.js.map