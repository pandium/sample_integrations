import { Page } from '../models/Page';
import { VersionUser } from '../models/VersionUser';
export declare class VersionPage {
    'id': string;
    'user': VersionUser;
    'object': Page;
    'updatedAt': Date;
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
