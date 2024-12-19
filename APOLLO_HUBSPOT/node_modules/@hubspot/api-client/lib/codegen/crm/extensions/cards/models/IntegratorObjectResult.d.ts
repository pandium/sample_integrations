import { IntegratorObjectResultActionsInner } from '../models/IntegratorObjectResultActionsInner';
import { ObjectToken } from '../models/ObjectToken';
export declare class IntegratorObjectResult {
    'id': string;
    'title': string;
    'linkUrl'?: string;
    'tokens': Array<ObjectToken>;
    'actions': Array<IntegratorObjectResultActionsInner>;
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
