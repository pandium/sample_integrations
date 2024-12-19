"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.extensions.videoconferencing;
        expect(client.hasOwnProperty('settingsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=videoconferencing.spec.js.map