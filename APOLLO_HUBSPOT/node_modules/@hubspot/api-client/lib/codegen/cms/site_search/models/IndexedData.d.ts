import { IndexedField } from '../models/IndexedField';
export declare class IndexedData {
    'id': string;
    'type': IndexedDataTypeEnum;
    'fields': {
        [key: string]: IndexedField;
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
export type IndexedDataTypeEnum = "LANDING_PAGE" | "BLOG_POST" | "SITE_PAGE" | "KNOWLEDGE_ARTICLE" | "LISTING_PAGE";
