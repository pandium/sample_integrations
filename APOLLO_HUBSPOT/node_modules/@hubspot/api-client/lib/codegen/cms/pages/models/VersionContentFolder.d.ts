import { ContentFolder } from '../models/ContentFolder';
import { VersionUser } from '../models/VersionUser';
export declare class VersionContentFolder {
    'id': string;
    'user': VersionUser;
    'object': ContentFolder;
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
