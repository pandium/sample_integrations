export declare class Angle {
    'value': number;
    'units': AngleUnitsEnum;
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
export type AngleUnitsEnum = "deg" | "grad" | "rad" | "turn";
