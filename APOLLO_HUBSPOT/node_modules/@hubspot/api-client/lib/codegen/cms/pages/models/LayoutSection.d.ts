import { RowMetaData } from '../models/RowMetaData';
import { Styles } from '../models/Styles';
export declare class LayoutSection {
    'cssStyle': string;
    'label': string;
    'type': string;
    'params': {
        [key: string]: any;
    };
    'rows': Array<{
        [key: string]: LayoutSection;
    }>;
    'rowMetaData': Array<RowMetaData>;
    'cells': Array<LayoutSection>;
    'cssClass': string;
    'w': number;
    'cssId': string;
    'x': number;
    'name': string;
    'styles': Styles;
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
