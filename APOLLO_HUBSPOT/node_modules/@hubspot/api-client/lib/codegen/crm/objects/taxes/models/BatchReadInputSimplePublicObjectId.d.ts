import { SimplePublicObjectId } from '../models/SimplePublicObjectId';
export declare class BatchReadInputSimplePublicObjectId {
    'propertiesWithHistory': Array<string>;
    'idProperty'?: string;
    'inputs': Array<SimplePublicObjectId>;
    'properties': Array<string>;
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
