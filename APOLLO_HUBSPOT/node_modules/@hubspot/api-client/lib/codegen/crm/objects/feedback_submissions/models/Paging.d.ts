import { NextPage } from '../models/NextPage';
import { PreviousPage } from '../models/PreviousPage';
export declare class Paging {
    'next'?: NextPage;
    'prev'?: PreviousPage;
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
