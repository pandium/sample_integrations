export declare class BackgroundImage {
    'imageUrl': string;
    'backgroundSize': string;
    'backgroundPosition': BackgroundImageBackgroundPositionEnum;
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
export type BackgroundImageBackgroundPositionEnum = "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" | "MIDDLE_LEFT" | "MIDDLE_CENTER" | "MIDDLE_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";
