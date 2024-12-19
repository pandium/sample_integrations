import { AccountingExtensionInvoice } from '../models/AccountingExtensionInvoice';
export declare class InvoicesResponseExternal {
    'result'?: InvoicesResponseExternalResultEnum;
    'invoices': Array<AccountingExtensionInvoice>;
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
export type InvoicesResponseExternalResultEnum = "OK" | "ERR";
