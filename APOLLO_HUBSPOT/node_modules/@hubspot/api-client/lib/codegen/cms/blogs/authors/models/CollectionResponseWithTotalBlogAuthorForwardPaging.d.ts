import { BlogAuthor } from '../models/BlogAuthor';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseWithTotalBlogAuthorForwardPaging {
    'total': number;
    'results': Array<BlogAuthor>;
    'paging'?: ForwardPaging;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
        format: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
        format: string;
    }[];
    constructor();
}
