import { FilterGroup } from '../models/FilterGroup';
export declare class PublicObjectSearchRequest {
    'filterGroups': Array<FilterGroup>;
    'sorts': Array<string>;
    'query'?: string;
    'properties': Array<string>;
    'limit': number;
    'after': number;
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
