"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../../codegen/cms/blogs/blog_posts/index");
const rxjsStub_1 = require("../../../../../codegen/cms/blogs/blog_posts/rxjsStub");
const ApiClientConfigurator_1 = require("../../../../configuration/ApiClientConfigurator");
const ApiDecoratorService_1 = __importDefault(require("../../../../services/ApiDecoratorService"));
class BlogPostsDiscovery {
    constructor(config) {
        const configuration = (0, index_1.createConfiguration)(ApiClientConfigurator_1.ApiClientConfigurator.getParams(config, index_1.ServerConfiguration, rxjsStub_1.Observable, rxjsStub_1.Observable));
        this.blogPostsApi = ApiDecoratorService_1.default.getInstance().apply(new index_1.BlogPostsApi(configuration));
    }
}
exports.default = BlogPostsDiscovery;
//# sourceMappingURL=BlogPostsDiscovery.js.map