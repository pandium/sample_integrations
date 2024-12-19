import { Angle } from '../models/Angle';
import { ColorStop } from '../models/ColorStop';
import { SideOrCorner } from '../models/SideOrCorner';
export declare class Gradient {
    'angle': Angle;
    'sideOrCorner': SideOrCorner;
    'colors': Array<ColorStop>;
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
