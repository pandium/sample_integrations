"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const ActionsDiscovery_1 = __importDefault(require("../../../src/discovery/automation/actions/ActionsDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().automation;
        expect(ActionsDiscovery_1.default.name).toBe(client.actions.constructor.name);
    });
});
//# sourceMappingURL=automation.spec.js.map