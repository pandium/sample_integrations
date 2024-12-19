import { CardActions } from '../models/CardActions';
import { CardDisplayBody } from '../models/CardDisplayBody';
import { CardFetchBody } from '../models/CardFetchBody';
export declare class CardResponse {
    'id': string;
    'createdAt'?: Date;
    'updatedAt'?: Date;
    'title': string;
    'fetch': CardFetchBody;
    'display': CardDisplayBody;
    'actions': CardActions;
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
