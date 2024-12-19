import { StandardError } from '../models/StandardError';
import { TimelineEventResponse } from '../models/TimelineEventResponse';
export declare class BatchResponseTimelineEventResponseWithErrors {
    'status': BatchResponseTimelineEventResponseWithErrorsStatusEnum;
    'results': Array<TimelineEventResponse>;
    'numErrors'?: number;
    'errors'?: Array<StandardError>;
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
export type BatchResponseTimelineEventResponseWithErrorsStatusEnum = "PENDING" | "PROCESSING" | "CANCELED" | "COMPLETE";
