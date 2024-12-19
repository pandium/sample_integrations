export declare class ErrorDetail {
    'message': string;
    '_in'?: string;
    'code'?: string;
    'subCategory'?: string;
    'context'?: {
        [key: string]: Array<string>;
    };
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
