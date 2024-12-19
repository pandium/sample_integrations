"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().cms.hubdb;
        expect(client.hasOwnProperty('rowsApi')).toBeTruthy();
        expect(client.hasOwnProperty('rowsBatchApi')).toBeTruthy();
        expect(client.hasOwnProperty('tablesApi')).toBeTruthy();
    });
});
//# sourceMappingURL=hubdb.spec.js.map