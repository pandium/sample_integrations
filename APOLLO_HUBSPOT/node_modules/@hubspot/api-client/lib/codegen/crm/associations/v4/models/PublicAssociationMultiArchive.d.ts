import { PublicObjectId } from '../models/PublicObjectId';
export declare class PublicAssociationMultiArchive {
    '_from': PublicObjectId;
    'to': Array<PublicObjectId>;
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
