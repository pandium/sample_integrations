import { SimplePublicObjectInput } from '../models/SimplePublicObjectInput';
export declare class BatchInputSimplePublicObjectInput {
    'inputs': Array<SimplePublicObjectInput>;
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
