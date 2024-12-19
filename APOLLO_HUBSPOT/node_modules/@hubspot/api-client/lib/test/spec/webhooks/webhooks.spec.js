"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().webhooks;
        expect(client.hasOwnProperty('settingsApi')).toBeTruthy();
        expect(client.hasOwnProperty('subscriptionsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=webhooks.spec.js.map