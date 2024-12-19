import { CreateInvoiceFeature } from '../models/CreateInvoiceFeature';
import { ImportInvoiceFeature } from '../models/ImportInvoiceFeature';
import { ObjectSyncFeature } from '../models/ObjectSyncFeature';
export declare class AccountingFeatures {
    'createInvoice': CreateInvoiceFeature;
    'importInvoice': ImportInvoiceFeature;
    'sync': {
        [key: string]: ObjectSyncFeature;
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
