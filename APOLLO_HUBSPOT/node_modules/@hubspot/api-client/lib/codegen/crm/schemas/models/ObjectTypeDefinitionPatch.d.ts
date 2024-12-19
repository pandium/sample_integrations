import { ObjectTypeDefinitionLabels } from '../models/ObjectTypeDefinitionLabels';
export declare class ObjectTypeDefinitionPatch {
    'labels'?: ObjectTypeDefinitionLabels;
    'requiredProperties'?: Array<string>;
    'searchableProperties'?: Array<string>;
    'primaryDisplayProperty'?: string;
    'secondaryDisplayProperties'?: Array<string>;
    'restorable'?: boolean;
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
