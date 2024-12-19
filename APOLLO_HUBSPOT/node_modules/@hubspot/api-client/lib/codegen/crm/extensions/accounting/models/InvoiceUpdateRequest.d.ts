export declare class InvoiceUpdateRequest {
    'externalInvoiceNumber'?: string;
    'currencyCode'?: string;
    'dueDate'?: string;
    'externalRecipientId'?: string;
    'receivedByRecipientDate'?: number;
    'isVoided'?: boolean;
    'receivedByCustomerDate'?: string;
    'invoiceNumber'?: string;
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
