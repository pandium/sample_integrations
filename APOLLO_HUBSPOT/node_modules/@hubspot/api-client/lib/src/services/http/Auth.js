"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const AuthTypes_1 = require("./AuthTypes");
class Auth {
    static chooseAuth(opts = {}, config = {}) {
        let type;
        if (opts.authType) {
            if (opts.authType !== 'none' && (0, lodash_get_1.default)(config, opts.authType)) {
                type = opts.authType;
            }
        }
        else {
            for (const key in AuthTypes_1.AuthTypes) {
                if ((0, lodash_get_1.default)(config, key)) {
                    type = key;
                }
            }
        }
        return type;
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map