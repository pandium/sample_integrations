import { CardActions } from '../models/CardActions';
import { CardDisplayBody } from '../models/CardDisplayBody';
import { CardFetchBodyPatch } from '../models/CardFetchBodyPatch';
export declare class CardPatchRequest {
    'title'?: string;
    'fetch'?: CardFetchBodyPatch;
    'display'?: CardDisplayBody;
    'actions'?: CardActions;
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
