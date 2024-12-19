"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
const AuthorsDiscovery_1 = __importDefault(require("../../../../src/discovery/cms/blogs/authors/AuthorsDiscovery"));
const BlogPostsDiscovery_1 = __importDefault(require("../../../../src/discovery/cms/blogs/blog_posts/BlogPostsDiscovery"));
const TagsDiscovery_1 = __importDefault(require("../../../../src/discovery/cms/blogs/tags/TagsDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().cms.blogs;
        expect(AuthorsDiscovery_1.default.name).toBe(client.authors.constructor.name);
        expect(BlogPostsDiscovery_1.default.name).toBe(client.blogPosts.constructor.name);
        expect(TagsDiscovery_1.default.name).toBe(client.tags.constructor.name);
    });
});
//# sourceMappingURL=blogs.spec.js.map