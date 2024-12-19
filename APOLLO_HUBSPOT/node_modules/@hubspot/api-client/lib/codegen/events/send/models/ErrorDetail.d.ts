export declare class ErrorDetail {
    'subCategory'?: string;
    'code'?: string;
    '_in'?: string;
    'context'?: {
        [key: string]: Array<string>;
    };
    'message': string;
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
