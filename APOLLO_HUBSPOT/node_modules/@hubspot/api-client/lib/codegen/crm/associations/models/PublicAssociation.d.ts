import { PublicObjectId } from '../models/PublicObjectId';
export declare class PublicAssociation {
    '_from': PublicObjectId;
    'to': PublicObjectId;
    'type': string;
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
