import { PublicPermissionSet } from '../models/PublicPermissionSet';
export declare class CollectionResponsePublicPermissionSetNoPaging {
    'results': Array<PublicPermissionSet>;
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
