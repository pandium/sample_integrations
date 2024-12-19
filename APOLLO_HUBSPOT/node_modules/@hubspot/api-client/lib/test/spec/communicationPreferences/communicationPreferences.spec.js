"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().communicationPreferences;
        expect(client.hasOwnProperty('definitionApi')).toBeTruthy();
        expect(client.hasOwnProperty('statusApi')).toBeTruthy();
    });
});
//# sourceMappingURL=communicationPreferences.spec.js.map