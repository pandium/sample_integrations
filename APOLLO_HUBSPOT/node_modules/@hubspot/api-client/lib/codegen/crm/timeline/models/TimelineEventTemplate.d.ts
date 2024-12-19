import { TimelineEventTemplateToken } from '../models/TimelineEventTemplateToken';
export declare class TimelineEventTemplate {
    'name': string;
    'headerTemplate'?: string;
    'detailTemplate'?: string;
    'tokens': Array<TimelineEventTemplateToken>;
    'id': string;
    'objectType': string;
    'createdAt'?: Date;
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
