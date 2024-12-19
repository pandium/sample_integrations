import { CreateInvoiceSubFeatures } from '../models/CreateInvoiceSubFeatures';
export declare class CreateInvoiceFeature {
    'enabled': boolean;
    'subFeatures': CreateInvoiceSubFeatures;
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
