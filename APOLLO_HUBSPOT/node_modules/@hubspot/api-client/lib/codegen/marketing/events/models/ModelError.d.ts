import { ErrorDetail } from '../models/ErrorDetail';
export declare class ModelError {
    'subCategory'?: string;
    'context'?: {
        [key: string]: Array<string>;
    };
    'correlationId': string;
    'links'?: {
        [key: string]: string;
    };
    'message': string;
    'category': string;
    'errors'?: Array<ErrorDetail>;
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
