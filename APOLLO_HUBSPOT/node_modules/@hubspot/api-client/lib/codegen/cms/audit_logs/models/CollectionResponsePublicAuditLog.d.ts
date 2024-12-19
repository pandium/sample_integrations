import { Paging } from '../models/Paging';
import { PublicAuditLog } from '../models/PublicAuditLog';
export declare class CollectionResponsePublicAuditLog {
    'results': Array<PublicAuditLog>;
    'paging'?: Paging;
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
