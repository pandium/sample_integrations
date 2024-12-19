import { BackgroundImage } from '../models/BackgroundImage';
import { Gradient } from '../models/Gradient';
import { RGBAColor } from '../models/RGBAColor';
export declare class Styles {
    'verticalAlignment': StylesVerticalAlignmentEnum;
    'backgroundColor': RGBAColor;
    'backgroundImage': BackgroundImage;
    'backgroundGradient': Gradient;
    'maxWidthSectionCentering': number;
    'forceFullWidthSection': boolean;
    'flexboxPositioning': StylesFlexboxPositioningEnum;
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
export type StylesVerticalAlignmentEnum = "TOP" | "MIDDLE" | "BOTTOM";
export type StylesFlexboxPositioningEnum = "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" | "MIDDLE_LEFT" | "MIDDLE_CENTER" | "MIDDLE_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";
