import { CardObjectTypeBody } from '../models/CardObjectTypeBody';
export declare class CardFetchBodyPatch {
    'targetUrl'?: string;
    'objectTypes': Array<CardObjectTypeBody>;
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
