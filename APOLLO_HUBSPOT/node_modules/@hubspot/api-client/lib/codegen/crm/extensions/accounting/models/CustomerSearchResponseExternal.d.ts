import { AccountingExtensionCustomer } from '../models/AccountingExtensionCustomer';
export declare class CustomerSearchResponseExternal {
    'result': CustomerSearchResponseExternalResultEnum;
    'customers': Array<AccountingExtensionCustomer>;
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
export type CustomerSearchResponseExternalResultEnum = "OK" | "ERR";
