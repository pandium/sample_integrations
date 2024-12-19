import { ExternalUnifiedEvent } from '../models/ExternalUnifiedEvent';
import { Paging } from '../models/Paging';
export declare class CollectionResponseExternalUnifiedEvent {
    'results': Array<ExternalUnifiedEvent>;
    'paging'?: Paging;
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
