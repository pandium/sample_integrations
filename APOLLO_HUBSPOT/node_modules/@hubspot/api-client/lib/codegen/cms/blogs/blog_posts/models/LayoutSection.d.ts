import { RowMetaData } from '../models/RowMetaData';
import { Styles } from '../models/Styles';
export declare class LayoutSection {
    'x': number;
    'w': number;
    'name': string;
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
    'cssStyle': string;
    'cssId': string;
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
