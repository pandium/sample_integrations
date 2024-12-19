import { UpdatedContact } from '../models/UpdatedContact';
export declare class SyncContactsRequest {
    'accountId': string;
    'contacts': Array<UpdatedContact>;
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
