import { IntegratorObjectResult } from '../models/IntegratorObjectResult';
import { TopLevelActions } from '../models/TopLevelActions';
export declare class IntegratorCardPayloadResponse {
    'totalCount': number;
    'allItemsLinkUrl'?: string;
    'cardLabel'?: string;
    'topLevelActions'?: TopLevelActions;
    'sections'?: Array<IntegratorObjectResult>;
    'responseVersion'?: IntegratorCardPayloadResponseResponseVersionEnum;
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
export type IntegratorCardPayloadResponseResponseVersionEnum = "v1" | "v3";
