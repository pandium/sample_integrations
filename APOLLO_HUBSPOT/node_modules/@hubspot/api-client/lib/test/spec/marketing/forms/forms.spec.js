"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().marketing.forms;
        expect(client.hasOwnProperty('formsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=forms.spec.js.map