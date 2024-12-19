export * from '../models/BatchInputSubscriptionBatchUpdateRequest';
export * from '../models/BatchResponseSubscriptionResponse';
export * from '../models/BatchResponseSubscriptionResponseWithErrors';
export * from '../models/ErrorDetail';
export * from '../models/ModelError';
export * from '../models/SettingsChangeRequest';
export * from '../models/SettingsResponse';
export * from '../models/StandardError';
export * from '../models/SubscriptionBatchUpdateRequest';
export * from '../models/SubscriptionCreateRequest';
export * from '../models/SubscriptionListResponse';
export * from '../models/SubscriptionPatchRequest';
export * from '../models/SubscriptionResponse';
export * from '../models/ThrottlingSettings';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
