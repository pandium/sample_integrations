import { Paging } from '../models/Paging';
import { VersionPage } from '../models/VersionPage';
export declare class CollectionResponseWithTotalVersionPage {
    'total': number;
    'paging'?: Paging;
    'results': Array<VersionPage>;
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
