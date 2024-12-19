import { BackgroundImage } from '../models/BackgroundImage';
import { Gradient } from '../models/Gradient';
import { RGBAColor } from '../models/RGBAColor';
export declare class Styles {
    'backgroundColor': RGBAColor;
    'flexboxPositioning': string;
    'backgroundImage': BackgroundImage;
    'forceFullWidthSection': boolean;
    'verticalAlignment': string;
    'maxWidthSectionCentering': number;
    'backgroundGradient': Gradient;
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
