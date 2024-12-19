import { ObjectTypeDefinitionLabels } from '../models/ObjectTypeDefinitionLabels';
export declare class ObjectTypeDefinition {
    'labels': ObjectTypeDefinitionLabels;
    'requiredProperties': Array<string>;
    'searchableProperties': Array<string>;
    'primaryDisplayProperty'?: string;
    'secondaryDisplayProperties': Array<string>;
    'archived': boolean;
    'id': string;
    'fullyQualifiedName': string;
    'createdAt'?: Date;
    'updatedAt'?: Date;
    'objectTypeId': string;
    'name': string;
    'portalId'?: number;
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
