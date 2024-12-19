"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.pipelines;
        expect(client.hasOwnProperty('pipelineAuditsApi')).toBeTruthy();
        expect(client.hasOwnProperty('pipelineStageAuditsApi')).toBeTruthy();
        expect(client.hasOwnProperty('pipelineStagesApi')).toBeTruthy();
        expect(client.hasOwnProperty('pipelinesApi')).toBeTruthy();
    });
});
//# sourceMappingURL=pipelines.spec.js.map