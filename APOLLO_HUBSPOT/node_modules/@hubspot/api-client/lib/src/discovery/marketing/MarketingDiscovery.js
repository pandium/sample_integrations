"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class MarketingDiscovery extends BaseDiscovery_1.default {
    get events() {
        if (!this._events) {
            const requiredClass = require('./events/EventsDiscovery');
            this._events = new requiredClass.default(this.config);
        }
        return this._events;
    }
    get forms() {
        if (!this._forms) {
            const requiredClass = require('./forms/FormsDiscovery');
            this._forms = new requiredClass.default(this.config);
        }
        return this._forms;
    }
    get transactional() {
        if (!this._transactional) {
            const requiredClass = require('./transactional/TransactionalDiscovery');
            this._transactional = new requiredClass.default(this.config);
        }
        return this._transactional;
    }
}
exports.default = MarketingDiscovery;
//# sourceMappingURL=MarketingDiscovery.js.map