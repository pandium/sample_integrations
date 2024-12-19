"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscovery_1 = __importDefault(require("../../BaseDiscovery"));
class BlogsDiscovery extends BaseDiscovery_1.default {
    get authors() {
        if (!this._authors) {
            const requiredClass = require('./authors/AuthorsDiscovery');
            this._authors = new requiredClass.default(this.config);
        }
        return this._authors;
    }
    get blogPosts() {
        if (!this._blogPosts) {
            const requiredClass = require('./blog_posts/BlogPostsDiscovery');
            this._blogPosts = new requiredClass.default(this.config);
        }
        return this._blogPosts;
    }
    get tags() {
        if (!this._tags) {
            const requiredClass = require('./tags/TagsDiscovery');
            this._tags = new requiredClass.default(this.config);
        }
        return this._tags;
    }
}
exports.default = BlogsDiscovery;
//# sourceMappingURL=BlogsDiscovery.js.map