"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForwardPaging = void 0;
class ForwardPaging {
    static getAttributeTypeMap() {
        return ForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ForwardPaging = ForwardPaging;
ForwardPaging.discriminator = undefined;
ForwardPaging.attributeTypeMap = [
    {
        "name": "next",
        "baseName": "next",
        "type": "NextPage",
        "format": ""
    }
];
//# sourceMappingURL=ForwardPaging.js.map