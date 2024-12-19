"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class ConversationsDiscovery extends BaseDiscovery_1.default {
    get visitorIdentification() {
        if (!this._visitorIdentification) {
            const requiredClass = require('./visitor_identification/VisitorIdentificationDiscovery');
            this._visitorIdentification = new requiredClass.default(this.config);
        }
        return this._visitorIdentification;
    }
}
exports.default = ConversationsDiscovery;
//# sourceMappingURL=ConversationsDiscovery.js.map