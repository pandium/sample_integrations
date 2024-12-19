"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../codegen/cms/pages/index");
const index_2 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_2.Client().cms.pages;
        expect(client.hasOwnProperty('landingPagesApi')).toBeTruthy();
        expect(index_1.LandingPagesApi.name).toBe(client.landingPagesApi.constructor.name);
        expect(client.hasOwnProperty('sitePagesApi')).toBeTruthy();
        expect(index_1.SitePagesApi.name).toBe(client.sitePagesApi.constructor.name);
    });
});
//# sourceMappingURL=pages.spec.js.map