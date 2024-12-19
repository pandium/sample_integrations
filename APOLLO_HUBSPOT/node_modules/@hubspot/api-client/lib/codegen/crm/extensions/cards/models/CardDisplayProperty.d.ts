import { DisplayOption } from '../models/DisplayOption';
export declare class CardDisplayProperty {
    'name': string;
    'label': string;
    'dataType': CardDisplayPropertyDataTypeEnum;
    'options': Array<DisplayOption>;
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
export type CardDisplayPropertyDataTypeEnum = "BOOLEAN" | "CURRENCY" | "DATE" | "DATETIME" | "EMAIL" | "LINK" | "NUMERIC" | "STRING" | "STATUS";
