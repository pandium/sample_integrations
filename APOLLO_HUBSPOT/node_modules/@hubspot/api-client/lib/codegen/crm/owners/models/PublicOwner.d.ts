import { PublicTeam } from '../models/PublicTeam';
export declare class PublicOwner {
    'id': string;
    'email'?: string;
    'firstName'?: string;
    'lastName'?: string;
    'userId'?: number;
    'createdAt': Date;
    'updatedAt': Date;
    'archived': boolean;
    'teams'?: Array<PublicTeam>;
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
