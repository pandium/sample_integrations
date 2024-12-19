import { TimelineEventTemplateToken } from '../models/TimelineEventTemplateToken';
export declare class TimelineEventTemplateUpdateRequest {
    'name': string;
    'headerTemplate'?: string;
    'detailTemplate'?: string;
    'tokens': Array<TimelineEventTemplateToken>;
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
