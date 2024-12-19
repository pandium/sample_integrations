export declare class InvoicePdfResponse {
    'result'?: InvoicePdfResponseResultEnum;
    'invoice': string;
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
export type InvoicePdfResponseResultEnum = "OK" | "ERR";
