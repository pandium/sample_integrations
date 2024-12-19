"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
const SchemaDiscovery_1 = __importDefault(require("../../../../src/discovery/crm/associations/schema/SchemaDiscovery"));
const AssociationsDiscovery_1 = __importDefault(require("../../../../src/discovery/crm/associations/v4/AssociationsDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm.associations;
        expect(client.hasOwnProperty('batchApi')).toBeTruthy();
        expect(SchemaDiscovery_1.default.name).toBe(client.schema.constructor.name);
        expect(AssociationsDiscovery_1.default.name).toBe(client.v4.constructor.name);
    });
});
//# sourceMappingURL=associations.spec.js.map