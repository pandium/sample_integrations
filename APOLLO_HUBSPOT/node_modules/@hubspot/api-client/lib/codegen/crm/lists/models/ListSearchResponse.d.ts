import { PublicObjectListSearchResult } from '../models/PublicObjectListSearchResult';
export declare class ListSearchResponse {
    'total': number;
    'offset': number;
    'lists': Array<PublicObjectListSearchResult>;
    'hasMore': boolean;
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
