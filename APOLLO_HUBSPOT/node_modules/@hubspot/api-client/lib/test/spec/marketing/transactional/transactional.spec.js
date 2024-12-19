"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().marketing.transactional;
        expect(client.hasOwnProperty('publicSmtpTokensApi')).toBeTruthy();
        expect(client.hasOwnProperty('singleSendApi')).toBeTruthy();
    });
});
//# sourceMappingURL=transactional.spec.js.map