export declare class AccountingAppUrls {
    'getInvoiceUrl': string;
    'searchCustomerUrl': string;
    'getInvoicePdfUrl': string;
    'customerUrlTemplate': string;
    'productUrlTemplate': string;
    'invoiceUrlTemplate': string;
    'createInvoiceUrl'?: string;
    'searchInvoiceUrl'?: string;
    'searchProductUrl'?: string;
    'getTermsUrl'?: string;
    'createCustomerUrl'?: string;
    'searchTaxUrl'?: string;
    'exchangeRateUrl'?: string;
    'searchUrl'?: string;
    'searchCountUrl'?: string;
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
