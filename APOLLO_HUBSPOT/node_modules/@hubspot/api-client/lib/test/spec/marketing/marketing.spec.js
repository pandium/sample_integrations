"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const EventsDiscovery_1 = __importDefault(require("../../../src/discovery/marketing/events/EventsDiscovery"));
const FormsDiscovery_1 = __importDefault(require("../../../src/discovery/marketing/forms/FormsDiscovery"));
const TransactionalDiscovery_1 = __importDefault(require("../../../src/discovery/marketing/transactional/TransactionalDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().marketing;
        expect(EventsDiscovery_1.default.name).toBe(client.events.constructor.name);
        expect(FormsDiscovery_1.default.name).toBe(client.forms.constructor.name);
        expect(TransactionalDiscovery_1.default.name).toBe(client.transactional.constructor.name);
    });
});
//# sourceMappingURL=marketing.spec.js.map