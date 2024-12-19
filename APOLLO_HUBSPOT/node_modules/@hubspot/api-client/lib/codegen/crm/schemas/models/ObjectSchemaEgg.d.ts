import { ObjectTypeDefinitionLabels } from '../models/ObjectTypeDefinitionLabels';
import { ObjectTypePropertyCreate } from '../models/ObjectTypePropertyCreate';
export declare class ObjectSchemaEgg {
    'labels': ObjectTypeDefinitionLabels;
    'requiredProperties': Array<string>;
    'searchableProperties': Array<string>;
    'primaryDisplayProperty'?: string;
    'secondaryDisplayProperties': Array<string>;
    'properties': Array<ObjectTypePropertyCreate>;
    'associatedObjects': Array<string>;
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
