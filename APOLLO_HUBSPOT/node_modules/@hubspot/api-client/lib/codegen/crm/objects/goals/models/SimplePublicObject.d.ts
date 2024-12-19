import { ValueWithTimestamp } from '../models/ValueWithTimestamp';
export declare class SimplePublicObject {
    'createdAt': Date;
    'archived'?: boolean;
    'archivedAt'?: Date;
    'propertiesWithHistory'?: {
        [key: string]: Array<ValueWithTimestamp>;
    };
    'id': string;
    'properties': {
        [key: string]: string | null;
    };
    'updatedAt': Date;
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
