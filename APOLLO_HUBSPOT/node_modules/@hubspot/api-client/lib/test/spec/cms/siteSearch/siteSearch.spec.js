"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().cms.siteSearch;
        expect(client.hasOwnProperty('publicApi')).toBeTruthy();
    });
});
//# sourceMappingURL=siteSearch.spec.js.map