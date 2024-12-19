"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.timeline;
        expect(client.hasOwnProperty('eventsApi')).toBeTruthy();
        expect(client.hasOwnProperty('templatesApi')).toBeTruthy();
        expect(client.hasOwnProperty('tokensApi')).toBeTruthy();
    });
});
//# sourceMappingURL=timeline.spec.js.map