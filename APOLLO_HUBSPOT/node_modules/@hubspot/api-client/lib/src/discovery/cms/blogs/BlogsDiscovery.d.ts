import BaseDiscovery from '../../BaseDiscovery';
import type AuthorsDiscovery from './authors/AuthorsDiscovery';
import type BlogPostsDiscovery from './blog_posts/BlogPostsDiscovery';
import type TagsDiscovery from './tags/TagsDiscovery';
export default class BlogsDiscovery extends BaseDiscovery {
    _authors: AuthorsDiscovery | undefined;
    _blogPosts: BlogPostsDiscovery | undefined;
    _tags: TagsDiscovery | undefined;
    get authors(): AuthorsDiscovery;
    get blogPosts(): BlogPostsDiscovery;
    get tags(): TagsDiscovery;
}
