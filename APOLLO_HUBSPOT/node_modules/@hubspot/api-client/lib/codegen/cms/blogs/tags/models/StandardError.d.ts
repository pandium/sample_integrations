import { ErrorDetail } from '../models/ErrorDetail';
export declare class StandardError {
    'status': string;
    'id'?: string;
    'category': any;
    'subCategory'?: any;
    'message': string;
    'errors': Array<ErrorDetail>;
    'context': {
        [key: string]: Array<string>;
    };
    'links': {
        [key: string]: string;
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
