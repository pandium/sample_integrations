import { PublicTeam } from '../models/PublicTeam';
export declare class CollectionResponsePublicTeamNoPaging {
    'results': Array<PublicTeam>;
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
