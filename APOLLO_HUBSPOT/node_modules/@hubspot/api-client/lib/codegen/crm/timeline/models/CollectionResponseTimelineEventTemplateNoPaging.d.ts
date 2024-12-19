import { TimelineEventTemplate } from '../models/TimelineEventTemplate';
export declare class CollectionResponseTimelineEventTemplateNoPaging {
    'results': Array<TimelineEventTemplate>;
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
