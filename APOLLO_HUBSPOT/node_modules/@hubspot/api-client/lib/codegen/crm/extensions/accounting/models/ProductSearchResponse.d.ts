import { Product } from '../models/Product';
export declare class ProductSearchResponse {
    'result'?: ProductSearchResponseResultEnum;
    'products': Array<Product>;
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
export type ProductSearchResponseResultEnum = "OK" | "ERR";
