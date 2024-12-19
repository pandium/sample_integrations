"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../codegen/crm/associations/index");
const rxjsStub_1 = require("../../../../codegen/crm/associations/rxjsStub");
const ApiClientConfigurator_1 = require("../../../configuration/ApiClientConfigurator");
const ApiDecoratorService_1 = __importDefault(require("../../../services/ApiDecoratorService"));
const BaseDiscovery_1 = __importDefault(require("../../BaseDiscovery"));
class AssociationsDiscovery extends BaseDiscovery_1.default {
    constructor(config) {
        super(config);
        const configuration = (0, index_1.createConfiguration)(ApiClientConfigurator_1.ApiClientConfigurator.getParams(config, index_1.ServerConfiguration, rxjsStub_1.Observable, rxjsStub_1.Observable));
        this.batchApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.BatchApi(configuration));
    }
    get schema() {
        if (!this._schema) {
            const requiredClass = require('./schema/SchemaDiscovery');
            this._schema = new requiredClass.default(this.config);
        }
        return this._schema;
    }
    get v4() {
        if (!this._v4) {
            const requiredClass = require('./v4/AssociationsDiscovery');
            this._v4 = new requiredClass.default(this.config);
        }
        return this._v4;
    }
}
exports.default = AssociationsDiscovery;
//# sourceMappingURL=AssociationsDiscovery.js.map