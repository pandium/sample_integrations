import { CardActions } from '../models/CardActions';
import { CardAuditResponse } from '../models/CardAuditResponse';
import { CardDisplayBody } from '../models/CardDisplayBody';
import { PublicCardFetchBody } from '../models/PublicCardFetchBody';
export declare class PublicCardResponse {
    'createdAt'?: Date;
    'fetch': PublicCardFetchBody;
    'display': CardDisplayBody;
    'id': string;
    'title': string;
    'actions': CardActions;
    'auditHistory': Array<CardAuditResponse>;
    'updatedAt'?: Date;
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
