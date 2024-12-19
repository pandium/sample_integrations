"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const VisitorIdentificationDiscovery_1 = __importDefault(require("../../../src/discovery/conversations/visitor_identification/VisitorIdentificationDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().conversations;
        expect(VisitorIdentificationDiscovery_1.default.name).toBe(client.visitorIdentification.constructor.name);
    });
});
//# sourceMappingURL=conversations.spec.js.map