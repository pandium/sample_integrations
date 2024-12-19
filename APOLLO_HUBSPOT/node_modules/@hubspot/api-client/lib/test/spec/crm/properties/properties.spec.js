"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.properties;
        expect(client.hasOwnProperty('batchApi')).toBeTruthy();
        expect(client.hasOwnProperty('coreApi')).toBeTruthy();
        expect(client.hasOwnProperty('groupsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=properties.spec.js.map