"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.extensions.cards;
        expect(client.hasOwnProperty('cardsApi')).toBeTruthy();
    });
});
//# sourceMappingURL=cards.spec.js.map