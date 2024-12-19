"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().cms.sourceCode;
        expect(client.hasOwnProperty('contentApi')).toBeTruthy();
        expect(client.hasOwnProperty('extractApi')).toBeTruthy();
        expect(client.hasOwnProperty('metadataApi')).toBeTruthy();
        expect(client.hasOwnProperty('sourceCodeExtractApi')).toBeTruthy();
        expect(client.hasOwnProperty('validationApi')).toBeTruthy();
    });
});
//# sourceMappingURL=sourceCode.spec.js.map