import { OptionInput } from '../models/OptionInput';
export declare class ObjectTypePropertyCreate {
    'name': string;
    'label': string;
    'groupName'?: string;
    'description'?: string;
    'options'?: Array<OptionInput>;
    'displayOrder'?: number;
    'hasUniqueValue'?: boolean;
    'hidden'?: boolean;
    'type': ObjectTypePropertyCreateTypeEnum;
    'fieldType': string;
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
export type ObjectTypePropertyCreateTypeEnum = "string" | "number" | "date" | "datetime" | "enumeration" | "bool";
