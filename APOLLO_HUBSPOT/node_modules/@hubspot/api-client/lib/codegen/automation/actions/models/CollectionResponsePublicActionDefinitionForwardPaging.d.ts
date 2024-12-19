import { ForwardPaging } from '../models/ForwardPaging';
import { PublicActionDefinition } from '../models/PublicActionDefinition';
export declare class CollectionResponsePublicActionDefinitionForwardPaging {
    'paging'?: ForwardPaging;
    'results': Array<PublicActionDefinition>;
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
