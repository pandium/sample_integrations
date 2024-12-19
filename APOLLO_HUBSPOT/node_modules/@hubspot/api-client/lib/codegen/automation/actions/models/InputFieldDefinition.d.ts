import { FieldTypeDefinition } from '../models/FieldTypeDefinition';
export declare class InputFieldDefinition {
    'typeDefinition': FieldTypeDefinition;
    'supportedValueTypes'?: Array<InputFieldDefinitionSupportedValueTypesEnum>;
    'isRequired': boolean;
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
export type InputFieldDefinitionSupportedValueTypesEnum = "STATIC_VALUE" | "OBJECT_PROPERTY" | "FIELD_DATA";
