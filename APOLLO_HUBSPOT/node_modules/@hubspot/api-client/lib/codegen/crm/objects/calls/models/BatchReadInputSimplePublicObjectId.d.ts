import { SimplePublicObjectId } from '../models/SimplePublicObjectId';
export declare class BatchReadInputSimplePublicObjectId {
    'properties': Array<string>;
    'propertiesWithHistory': Array<string>;
    'idProperty'?: string;
    'inputs': Array<SimplePublicObjectId>;
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
