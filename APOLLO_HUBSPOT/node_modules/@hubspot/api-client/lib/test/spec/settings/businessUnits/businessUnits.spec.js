"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../codegen/settings/business_units/index");
const index_2 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_2.Client().settings.businessUnits;
        expect(client.hasOwnProperty('businessUnitApi')).toBeTruthy();
        expect(index_1.BusinessUnitApi.name).toBe(client.businessUnitApi.constructor.name);
    });
});
//# sourceMappingURL=businessUnits.spec.js.map