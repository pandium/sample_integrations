"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
const AccountingDiscovery_1 = __importDefault(require("../../../../src/discovery/crm/extensions/accounting/AccountingDiscovery"));
const CallingDiscovery_1 = __importDefault(require("../../../../src/discovery/crm/extensions/calling/CallingDiscovery"));
const CardsDiscovery_1 = __importDefault(require("../../../../src/discovery/crm/extensions/cards/CardsDiscovery"));
const VideoconferencingDiscovery_1 = __importDefault(require("../../../../src/discovery/crm/extensions/videoconferencing/VideoconferencingDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.extensions;
        expect(AccountingDiscovery_1.default.name).toBe(client.accounting.constructor.name);
        expect(CallingDiscovery_1.default.name).toBe(client.calling.constructor.name);
        expect(CardsDiscovery_1.default.name).toBe(client.cards.constructor.name);
        expect(VideoconferencingDiscovery_1.default.name).toBe(client.videoconferencing.constructor.name);
    });
});
//# sourceMappingURL=extensions.spec.js.map