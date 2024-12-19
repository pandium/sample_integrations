"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const crypto = require("crypto");
class Signature {
    static isValid(_a) {
        var { method = 'POST', signatureVersion = 'v1' } = _a, options = __rest(_a, ["method", "signatureVersion"]);
        const hash = Signature.getSignature(method, signatureVersion, options);
        if (signatureVersion === 'v3') {
            const currentTime = Date.now();
            if (options.timestamp === undefined || currentTime - options.timestamp > Signature.MAX_ALLOWED_TIMESTAMP) {
                throw new Error('Timestamp is invalid, reject request');
            }
        }
        return options.signature === hash;
    }
    static getSignature(method, signatureVersion, options) {
        let sourceString = null;
        switch (signatureVersion) {
            case 'v1':
                sourceString = options.clientSecret + options.requestBody;
                return crypto.createHash('sha256').update(sourceString).digest('hex');
            case 'v2':
                sourceString = options.clientSecret + method + options.url + options.requestBody;
                return crypto.createHash('sha256').update(sourceString).digest('hex');
            case 'v3':
                sourceString = method + options.url + options.requestBody + options.timestamp;
                return crypto.createHmac('sha256', options.clientSecret).update(sourceString).digest('base64');
            default:
                throw new Error(`Not supported signature version: ${signatureVersion}`);
        }
    }
}
exports.Signature = Signature;
Signature.MAX_ALLOWED_TIMESTAMP = 300000;
//# sourceMappingURL=signature.js.map