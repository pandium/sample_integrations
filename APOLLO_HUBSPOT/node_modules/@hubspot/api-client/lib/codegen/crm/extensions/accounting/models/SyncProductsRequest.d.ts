import { UpdatedProduct } from '../models/UpdatedProduct';
export declare class SyncProductsRequest {
    'accountId': string;
    'products': Array<UpdatedProduct>;
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
