import { ForwardPaging } from '../models/ForwardPaging';
import { SmtpApiTokenView } from '../models/SmtpApiTokenView';
export declare class CollectionResponseSmtpApiTokenViewForwardPaging {
    'results': Array<SmtpApiTokenView>;
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
