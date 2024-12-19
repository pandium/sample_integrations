import { AssociationDefinition } from '../models/AssociationDefinition';
import { ObjectTypeDefinitionLabels } from '../models/ObjectTypeDefinitionLabels';
import { Property } from '../models/Property';
export declare class ObjectSchema {
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
    'properties': Array<Property>;
    'associations': Array<AssociationDefinition>;
    'name': string;
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
