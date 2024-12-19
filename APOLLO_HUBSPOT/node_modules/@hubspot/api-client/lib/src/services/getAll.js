"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const privateConstants_1 = require("../configuration/privateConstants");
function getAll(api, limit, after, properties, propertiesWithHistory, associations, archived) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const limitInternal = limit !== null && limit !== void 0 ? limit : privateConstants_1.DEFAULT_OBJECTS_LIMIT;
        let afterInternal = after;
        let result = [];
        do {
            const response = yield api.getPage(limitInternal, afterInternal, properties, propertiesWithHistory, associations, archived);
            result = result.concat(response.results);
            afterInternal = (_b = (_a = response === null || response === void 0 ? void 0 : response.paging) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.after;
        } while (afterInternal);
        return result;
    });
}
exports.getAll = getAll;
//# sourceMappingURL=getAll.js.map