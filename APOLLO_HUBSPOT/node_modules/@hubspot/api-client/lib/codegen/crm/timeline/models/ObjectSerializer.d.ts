export * from '../models/BatchInputTimelineEvent';
export * from '../models/BatchResponseTimelineEventResponse';
export * from '../models/BatchResponseTimelineEventResponseWithErrors';
export * from '../models/CollectionResponseTimelineEventTemplateNoPaging';
export * from '../models/ErrorDetail';
export * from '../models/EventDetail';
export * from '../models/ModelError';
export * from '../models/StandardError';
export * from '../models/TimelineEvent';
export * from '../models/TimelineEventIFrame';
export * from '../models/TimelineEventResponse';
export * from '../models/TimelineEventTemplate';
export * from '../models/TimelineEventTemplateCreateRequest';
export * from '../models/TimelineEventTemplateToken';
export * from '../models/TimelineEventTemplateTokenOption';
export * from '../models/TimelineEventTemplateTokenUpdateRequest';
export * from '../models/TimelineEventTemplateUpdateRequest';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
