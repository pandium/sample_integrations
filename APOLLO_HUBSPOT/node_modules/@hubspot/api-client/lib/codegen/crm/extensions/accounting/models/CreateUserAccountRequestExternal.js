"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserAccountRequestExternal = void 0;
class CreateUserAccountRequestExternal {
    static getAttributeTypeMap() {
        return CreateUserAccountRequestExternal.attributeTypeMap;
    }
    constructor() {
    }
}
exports.CreateUserAccountRequestExternal = CreateUserAccountRequestExternal;
CreateUserAccountRequestExternal.discriminator = undefined;
CreateUserAccountRequestExternal.attributeTypeMap = [
    {
        "name": "accountId",
        "baseName": "accountId",
        "type": "string",
        "format": ""
    },
    {
        "name": "accountName",
        "baseName": "accountName",
        "type": "string",
        "format": ""
    },
    {
        "name": "currencyCode",
        "baseName": "currencyCode",
        "type": "string",
        "format": ""
    }
];
//# sourceMappingURL=CreateUserAccountRequestExternal.js.map