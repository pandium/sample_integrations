export declare class CreateInvoiceSubFeatures {
    'createCustomer': boolean;
    'taxes': boolean;
    'exchangeRates': boolean;
    'terms': boolean;
    'invoiceComments': boolean;
    'invoiceDiscounts': boolean;
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
