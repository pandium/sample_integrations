"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().files;
        expect(client.hasOwnProperty('filesApi')).toBeTruthy();
        expect(client.hasOwnProperty('foldersApi')).toBeTruthy();
    });
});
//# sourceMappingURL=files.spec.js.map