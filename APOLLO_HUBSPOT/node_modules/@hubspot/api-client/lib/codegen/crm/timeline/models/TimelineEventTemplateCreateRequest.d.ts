import { TimelineEventTemplateToken } from '../models/TimelineEventTemplateToken';
export declare class TimelineEventTemplateCreateRequest {
    'name': string;
    'headerTemplate'?: string;
    'detailTemplate'?: string;
    'tokens': Array<TimelineEventTemplateToken>;
    'objectType': string;
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
