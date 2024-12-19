"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogAuthorCloneRequestVNext = void 0;
class BlogAuthorCloneRequestVNext {
    static getAttributeTypeMap() {
        return BlogAuthorCloneRequestVNext.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BlogAuthorCloneRequestVNext = BlogAuthorCloneRequestVNext;
BlogAuthorCloneRequestVNext.discriminator = undefined;
BlogAuthorCloneRequestVNext.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "language",
        "baseName": "language",
        "type": "string",
        "format": ""
    },
    {
        "name": "primaryLanguage",
        "baseName": "primaryLanguage",
        "type": "string",
        "format": ""
    },
    {
        "name": "blogAuthor",
        "baseName": "blogAuthor",
        "type": "BlogAuthor",
        "format": ""
    }
];
//# sourceMappingURL=BlogAuthorCloneRequestVNext.js.map