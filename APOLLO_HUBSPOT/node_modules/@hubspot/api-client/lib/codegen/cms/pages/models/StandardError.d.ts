import { ErrorDetail } from '../models/ErrorDetail';
export declare class StandardError {
    'subCategory'?: any;
    'context': {
        [key: string]: Array<string>;
    };
    'links': {
        [key: string]: string;
    };
    'id'?: string;
    'category': string;
    'message': string;
    'errors': Array<ErrorDetail>;
    'status': string;
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
