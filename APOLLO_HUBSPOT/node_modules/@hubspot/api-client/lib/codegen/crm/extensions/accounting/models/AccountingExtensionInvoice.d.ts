export declare class AccountingExtensionInvoice {
    'amountDue': number;
    'balance'?: number;
    'dueDate': string;
    'invoiceNumber'?: string;
    'customerId'?: string;
    'currency': string;
    'invoiceLink': string;
    'customerName': string;
    'status': AccountingExtensionInvoiceStatusEnum;
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
export type AccountingExtensionInvoiceStatusEnum = "CREATED" | "SENT" | "PAID" | "CLOSED" | "OVERDUE" | "VOIDED";
