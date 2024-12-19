"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../codegen/events/index");
const rxjsStub_1 = require("../../../codegen/events/rxjsStub");
const ApiClientConfigurator_1 = require("../../configuration/ApiClientConfigurator");
const ApiDecoratorService_1 = __importDefault(require("../../services/ApiDecoratorService"));
const BaseDiscovery_1 = __importDefault(require("../BaseDiscovery"));
class EventsDiscovery extends BaseDiscovery_1.default {
    constructor(config = {}) {
        super(config);
        const configuration = (0, index_1.createConfiguration)(ApiClientConfigurator_1.ApiClientConfigurator.getParams(config, index_1.ServerConfiguration, rxjsStub_1.Observable, rxjsStub_1.Observable));
        this.eventsApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.EventsApi(configuration));
    }
    get send() {
        if (!this._send) {
            const requiredClass = require('./send/SendDiscovery');
            this._send = new requiredClass.default(this.config);
        }
        return this._send;
    }
}
exports.default = EventsDiscovery;
//# sourceMappingURL=EventsDiscovery.js.map