import { BlogAuthor } from '../models/BlogAuthor';
export declare class BatchResponseBlogAuthor {
    'status': BatchResponseBlogAuthorStatusEnum;
    'results': Array<BlogAuthor>;
    'requestedAt'?: Date;
    'startedAt': Date;
    'completedAt': Date;
    'links'?: {
        [key: string]: string;
    };
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
export type BatchResponseBlogAuthorStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
