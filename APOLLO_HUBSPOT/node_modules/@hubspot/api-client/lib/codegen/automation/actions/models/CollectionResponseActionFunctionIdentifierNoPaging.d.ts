import { ActionFunctionIdentifier } from '../models/ActionFunctionIdentifier';
export declare class CollectionResponseActionFunctionIdentifierNoPaging {
    'results': Array<ActionFunctionIdentifier>;
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
