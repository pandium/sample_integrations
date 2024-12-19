"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class CrmDiscovery extends BaseDiscovery_1.default {
    get associations() {
        if (!this._associations) {
            const requiredClass = require('./associations/AssociationsDiscovery');
            this._associations = new requiredClass.default(this.config);
        }
        return this._associations;
    }
    get companies() {
        if (!this._companies) {
            const requiredClass = require('./companies/CompaniesDiscovery');
            this._companies = new requiredClass.default(this.config);
        }
        return this._companies;
    }
    get contacts() {
        if (!this._contacts) {
            const requiredClass = require('./contacts/ContactsDiscovery');
            this._contacts = new requiredClass.default(this.config);
        }
        return this._contacts;
    }
    get deals() {
        if (!this._deals) {
            const requiredClass = require('./deals/DealsDiscovery');
            this._deals = new requiredClass.default(this.config);
        }
        return this._deals;
    }
    get extensions() {
        if (!this._extensions) {
            const requiredClass = require('./extensions/ExtensionsDiscovery');
            this._extensions = new requiredClass.default(this.config);
        }
        return this._extensions;
    }
    get imports() {
        if (!this._imports) {
            const requiredClass = require('./imports/ImportsDiscovery');
            this._imports = new requiredClass.default(this.config);
        }
        return this._imports;
    }
    get lineItems() {
        if (!this._lineItems) {
            const requiredClass = require('./line_items/LineItemsDiscovery');
            this._lineItems = new requiredClass.default(this.config);
        }
        return this._lineItems;
    }
    get lists() {
        if (!this._lists) {
            const requiredClass = require('./lists/ListsDiscovery');
            this._lists = new requiredClass.default(this.config);
        }
        return this._lists;
    }
    get objects() {
        if (!this._objects) {
            const requiredClass = require('./objects/ObjectsDiscovery');
            this._objects = new requiredClass.default(this.config);
        }
        return this._objects;
    }
    get owners() {
        if (!this._owners) {
            const requiredClass = require('./owners/OwnersDiscovery');
            this._owners = new requiredClass.default(this.config);
        }
        return this._owners;
    }
    get pipelines() {
        if (!this._pipelines) {
            const requiredClass = require('./pipelines/PipelinesDiscovery');
            this._pipelines = new requiredClass.default(this.config);
        }
        return this._pipelines;
    }
    get products() {
        if (!this._products) {
            const requiredClass = require('./products/ProductsDiscovery');
            this._products = new requiredClass.default(this.config);
        }
        return this._products;
    }
    get properties() {
        if (!this._properties) {
            const requiredClass = require('./properties/PropertiesDiscovery');
            this._properties = new requiredClass.default(this.config);
        }
        return this._properties;
    }
    get quotes() {
        if (!this._quotes) {
            const requiredClass = require('./quotes/QuotesDiscovery');
            this._quotes = new requiredClass.default(this.config);
        }
        return this._quotes;
    }
    get schemas() {
        if (!this._schemas) {
            const requiredClass = require('./schemas/SchemasDiscovery');
            this._schemas = new requiredClass.default(this.config);
        }
        return this._schemas;
    }
    get tickets() {
        if (!this._tickets) {
            const requiredClass = require('./tickets/TicketsDiscovery');
            this._tickets = new requiredClass.default(this.config);
        }
        return this._tickets;
    }
    get timeline() {
        if (!this._timeline) {
            const requiredClass = require('./timeline/TimelineDiscovery');
            this._timeline = new requiredClass.default(this.config);
        }
        return this._timeline;
    }
}
exports.default = CrmDiscovery;
//# sourceMappingURL=CrmDiscovery.js.map