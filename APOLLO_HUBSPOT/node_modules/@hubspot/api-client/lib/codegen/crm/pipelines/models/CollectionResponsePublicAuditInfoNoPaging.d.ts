import { PublicAuditInfo } from '../models/PublicAuditInfo';
export declare class CollectionResponsePublicAuditInfoNoPaging {
    'results': Array<PublicAuditInfo>;
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
