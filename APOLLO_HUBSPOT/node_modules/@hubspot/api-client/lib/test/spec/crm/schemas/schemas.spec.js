"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.schemas;
        expect(client.hasOwnProperty('coreApi')).toBeTruthy();
        expect(client.hasOwnProperty('publicObjectSchemasApi')).toBeTruthy();
    });
});
//# sourceMappingURL=schemas.spec.js.map