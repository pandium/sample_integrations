import { TimelineEventResponse } from '../models/TimelineEventResponse';
export declare class BatchResponseTimelineEventResponse {
    'status': BatchResponseTimelineEventResponseStatusEnum;
    'results': Array<TimelineEventResponse>;
    'requestedAt'?: Date;
    'startedAt': Date;
    'completedAt': Date;
    'links'?: {
        [key: string]: string;
    };
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
export type BatchResponseTimelineEventResponseStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
