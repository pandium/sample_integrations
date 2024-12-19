import { BlogPost } from '../models/BlogPost';
export declare class BatchResponseBlogPost {
    'status': BatchResponseBlogPostStatusEnum;
    'results': Array<BlogPost>;
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
export type BatchResponseBlogPostStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
