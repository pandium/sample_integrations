import { Tax } from '../models/Tax';
export declare class TaxSearchResponse {
    'result'?: TaxSearchResponseResultEnum;
    'taxes': Array<Tax>;
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
export type TaxSearchResponseResultEnum = "OK" | "ERR";
