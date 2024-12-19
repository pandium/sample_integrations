export declare class ObjectToken {
    'name'?: string;
    'label'?: string;
    'dataType'?: ObjectTokenDataTypeEnum;
    'value': string;
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
export type ObjectTokenDataTypeEnum = "BOOLEAN" | "CURRENCY" | "DATE" | "DATETIME" | "EMAIL" | "LINK" | "NUMERIC" | "STRING" | "STATUS";
