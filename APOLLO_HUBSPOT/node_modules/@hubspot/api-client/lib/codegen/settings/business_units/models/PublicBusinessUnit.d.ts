import { PublicBusinessUnitLogoMetadata } from '../models/PublicBusinessUnitLogoMetadata';
export declare class PublicBusinessUnit {
    'logoMetadata'?: PublicBusinessUnitLogoMetadata;
    'name': string;
    'id': string;
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
