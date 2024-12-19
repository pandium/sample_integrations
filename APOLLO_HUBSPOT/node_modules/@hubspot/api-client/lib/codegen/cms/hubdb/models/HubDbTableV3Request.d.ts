import { ColumnRequest } from '../models/ColumnRequest';
export declare class HubDbTableV3Request {
    'name': string;
    'label': string;
    'useForPages'?: boolean;
    'allowPublicApiAccess'?: boolean;
    'allowChildTables'?: boolean;
    'enableChildTablePages'?: boolean;
    'columns'?: Array<ColumnRequest>;
    'dynamicMetaTags'?: {
        [key: string]: number;
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
