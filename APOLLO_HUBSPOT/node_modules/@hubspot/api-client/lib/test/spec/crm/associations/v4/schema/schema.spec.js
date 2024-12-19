"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.associations.v4.schema;
        expect(client.hasOwnProperty('definitionsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=schema.spec.js.map