"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.extensions.accounting;
        expect(client.hasOwnProperty('callbacksApi')).toBeTruthy();
        expect(client.hasOwnProperty('invoiceApi')).toBeTruthy();
        expect(client.hasOwnProperty('settingsApi')).toBeTruthy();
        expect(client.hasOwnProperty('syncApi')).toBeTruthy();
        expect(client.hasOwnProperty('userAccountsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=accounting.spec.js.map