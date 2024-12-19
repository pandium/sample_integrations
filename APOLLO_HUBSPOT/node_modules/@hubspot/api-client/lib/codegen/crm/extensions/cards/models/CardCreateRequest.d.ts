import { CardActions } from '../models/CardActions';
import { CardDisplayBody } from '../models/CardDisplayBody';
import { CardFetchBody } from '../models/CardFetchBody';
export declare class CardCreateRequest {
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
