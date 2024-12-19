import { BlogAuthor } from '../models/BlogAuthor';
import { StandardError } from '../models/StandardError';
export declare class BatchResponseBlogAuthorWithErrors {
    'status': BatchResponseBlogAuthorWithErrorsStatusEnum;
    'results': Array<BlogAuthor>;
    'numErrors'?: number;
    'errors'?: Array<StandardError>;
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
export type BatchResponseBlogAuthorWithErrorsStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
