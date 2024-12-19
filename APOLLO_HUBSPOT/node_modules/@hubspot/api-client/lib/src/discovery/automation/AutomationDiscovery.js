"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class AutomationDiscovery extends BaseDiscovery_1.default {
    get actions() {
        if (!this._actions) {
            const requiredClass = require('./actions/ActionsDiscovery');
            this._actions = new requiredClass.default(this.config);
        }
        return this._actions;
    }
}
exports.default = AutomationDiscovery;
//# sourceMappingURL=AutomationDiscovery.js.map