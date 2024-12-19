"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().automation.actions;
        expect(client.hasOwnProperty('callbacksApi')).toBeTruthy();
        expect(client.hasOwnProperty('definitionsApi')).toBeTruthy();
        expect(client.hasOwnProperty('functionsApi')).toBeTruthy();
        expect(client.hasOwnProperty('revisionsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=actions.spec.js.map