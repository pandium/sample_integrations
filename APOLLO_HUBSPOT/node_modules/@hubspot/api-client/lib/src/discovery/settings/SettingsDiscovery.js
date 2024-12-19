"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class SettingsDiscovery extends BaseDiscovery_1.default {
    get businessUnits() {
        if (!this._businessUnits) {
            const requiredClass = require('./business_units/BusinessUnitsDiscovery');
            this._businessUnits = new requiredClass.default(this.config);
        }
        return this._businessUnits;
    }
    get users() {
        if (!this._users) {
            const requiredClass = require('./users/UsersDiscovery');
            this._users = new requiredClass.default(this.config);
        }
        return this._users;
    }
}
exports.default = SettingsDiscovery;
//# sourceMappingURL=SettingsDiscovery.js.map