"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().oauth;
        expect(client.hasOwnProperty('accessTokensApi')).toBeTruthy();
        expect(client.hasOwnProperty('refreshTokensApi')).toBeTruthy();
        expect(client.hasOwnProperty('tokensApi')).toBeTruthy();
    });
});
//# sourceMappingURL=oauth.spec.js.map