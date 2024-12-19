export declare class SideOrCorner {
    'verticalSide': SideOrCornerVerticalSideEnum;
    'horizontalSide': SideOrCornerHorizontalSideEnum;
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
export type SideOrCornerVerticalSideEnum = "TOP" | "MIDDLE" | "BOTTOM";
export type SideOrCornerHorizontalSideEnum = "LEFT" | "CENTER" | "RIGHT";
