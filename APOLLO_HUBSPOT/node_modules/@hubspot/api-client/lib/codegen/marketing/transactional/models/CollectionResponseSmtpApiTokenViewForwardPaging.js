"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseSmtpApiTokenViewForwardPaging = void 0;
class CollectionResponseSmtpApiTokenViewForwardPaging {
    static getAttributeTypeMap() {
        return CollectionResponseSmtpApiTokenViewForwardPaging.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CollectionResponseSmtpApiTokenViewForwardPaging = CollectionResponseSmtpApiTokenViewForwardPaging;
CollectionResponseSmtpApiTokenViewForwardPaging.discriminator = undefined;
CollectionResponseSmtpApiTokenViewForwardPaging.attributeTypeMap = [
    {
        "name": "results",
        "baseName": "results",
        "type": "Array<SmtpApiTokenView>",
        "format": ""
    },
    {
        "name": "paging",
        "baseName": "paging",
        "type": "ForwardPaging",
        "format": ""
    }
];
//# sourceMappingURL=CollectionResponseSmtpApiTokenViewForwardPaging.js.map