export declare class InvoiceReadResponse {
    'externalInvoiceNumber'?: string;
    'totalAmountBilled': number;
    'balanceDue': number;
    'currencyCode': string;
    'dueDate': string;
    'externalRecipientId': string;
    'receivedByRecipientDate'?: number;
    'externalCreateDateTime'?: number;
    'isVoided': boolean;
    'createdAt': Date;
    'updatedAt': Date;
    'archivedAt'?: Date;
    'archived': boolean;
    'externalAccountId': string;
    'invoiceStatus': InvoiceReadResponseInvoiceStatusEnum;
    'id': string;
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
export type InvoiceReadResponseInvoiceStatusEnum = "CREATED" | "SENT" | "PAID" | "CLOSED" | "OVERDUE" | "VOIDED" | "NONE" | "UNPAID";
