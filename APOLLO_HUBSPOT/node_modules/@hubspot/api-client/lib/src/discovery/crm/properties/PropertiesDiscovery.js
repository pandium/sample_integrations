"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../codegen/crm/properties/index");
const rxjsStub_1 = require("../../../../codegen/crm/properties/rxjsStub");
const ApiClientConfigurator_1 = require("../../../configuration/ApiClientConfigurator");
const ApiDecoratorService_1 = __importDefault(require("../../../services/ApiDecoratorService"));
class PropertiesDiscovery {
    constructor(config) {
        const configuration = (0, index_1.createConfiguration)(ApiClientConfigurator_1.ApiClientConfigurator.getParams(config, index_1.ServerConfiguration, rxjsStub_1.Observable, rxjsStub_1.Observable));
        this.batchApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.BatchApi(configuration));
        this.coreApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.CoreApi(configuration));
        this.groupsApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.GroupsApi(configuration));
    }
}
exports.default = PropertiesDiscovery;
//# sourceMappingURL=PropertiesDiscovery.js.map