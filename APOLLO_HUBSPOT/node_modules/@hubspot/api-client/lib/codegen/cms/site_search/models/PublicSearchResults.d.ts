import { ContentSearchResult } from '../models/ContentSearchResult';
export declare class PublicSearchResults {
    'total': number;
    'offset': number;
    'limit': number;
    'results': Array<ContentSearchResult>;
    'searchTerm'?: string;
    'page': number;
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
