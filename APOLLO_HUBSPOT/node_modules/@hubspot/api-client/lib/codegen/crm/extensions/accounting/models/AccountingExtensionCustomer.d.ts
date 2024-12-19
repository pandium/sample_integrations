import { Address } from '../models/Address';
export declare class AccountingExtensionCustomer {
    'emailAddress'?: string;
    'name': string;
    'id': string;
    'billingAddress'?: Address;
    'currencyCode'?: string;
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
