"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../../BaseDiscovery"));
class ExtensionsDiscovery extends BaseDiscovery_1.default {
    get accounting() {
        if (!this._accounting) {
            const requiredClass = require('./accounting/AccountingDiscovery');
            this._accounting = new requiredClass.default(this.config);
        }
        return this._accounting;
    }
    get calling() {
        if (!this._calling) {
            const requiredClass = require('./calling/CallingDiscovery');
            this._calling = new requiredClass.default(this.config);
        }
        return this._calling;
    }
    get cards() {
        if (!this._cards) {
            const requiredClass = require('./cards/CardsDiscovery');
            this._cards = new requiredClass.default(this.config);
        }
        return this._cards;
    }
    get videoconferencing() {
        if (!this._videoconferencing) {
            const requiredClass = require('./videoconferencing/VideoconferencingDiscovery');
            this._videoconferencing = new requiredClass.default(this.config);
        }
        return this._videoconferencing;
    }
}
exports.default = ExtensionsDiscovery;
//# sourceMappingURL=ExtensionsDiscovery.js.map