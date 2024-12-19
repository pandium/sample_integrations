import { ExtensionActionDefinition } from '../models/ExtensionActionDefinition';
import { ForwardPaging } from '../models/ForwardPaging';
export declare class CollectionResponseExtensionActionDefinitionForwardPaging {
    'results': Array<ExtensionActionDefinition>;
    'paging'?: ForwardPaging;
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
