import { TaxType } from '../models/TaxType';
import { UnitPrice } from '../models/UnitPrice';
export declare class Product {
    'unitPrice': UnitPrice;
    'taxExempt': boolean;
    'salesTaxType'?: TaxType;
    'name': string;
    'description'?: string;
    'id': string;
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
