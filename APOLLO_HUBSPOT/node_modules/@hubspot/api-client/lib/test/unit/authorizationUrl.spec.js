"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
describe('Check Authorization Url', () => {
    it('should generate authorization url with optional_scope', () => {
        const client = new index_1.Client();
        const url = client.oauth.getAuthorizationUrl('clientid', 'http://localhost', 'contacts timeline', 'scope1 scope2');
        expect('https://app.hubspot.com/oauth/authorize?client_id=clientid&redirect_uri=http%3A%2F%2Flocalhost&scope=contacts%20timeline&optional_scope=scope1%20scope2').toBe(url);
    });
    it('should generate authorization url without optional_scope', () => {
        const client = new index_1.Client();
        const url = client.oauth.getAuthorizationUrl('clientid', 'http://localhost', 'contacts timeline');
        expect('https://app.hubspot.com/oauth/authorize?client_id=clientid&redirect_uri=http%3A%2F%2Flocalhost&scope=contacts%20timeline').toBe(url);
    });
});
//# sourceMappingURL=authorizationUrl.spec.js.map