"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().settings.users;
        expect(client.hasOwnProperty('rolesApi')).toBeTruthy();
        expect(client.hasOwnProperty('teamsApi')).toBeTruthy();
        expect(client.hasOwnProperty('usersApi')).toBeTruthy();
    });
});
//# sourceMappingURL=users.spec.js.map