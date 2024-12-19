import { AccountingExtensionInvoice } from '../models/AccountingExtensionInvoice';
export declare class InvoiceSearchResponse {
    'result'?: InvoiceSearchResponseResultEnum;
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
export type InvoiceSearchResponseResultEnum = "OK" | "ERR";
