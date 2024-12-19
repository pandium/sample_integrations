import { SimplePublicObjectInputForCreate } from '../models/SimplePublicObjectInputForCreate';
export declare class BatchInputSimplePublicObjectInputForCreate {
    'inputs': Array<SimplePublicObjectInputForCreate>;
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
