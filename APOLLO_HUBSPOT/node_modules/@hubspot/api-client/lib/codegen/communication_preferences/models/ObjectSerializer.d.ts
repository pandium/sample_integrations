export * from '../models/ErrorDetail';
export * from '../models/ModelError';
export * from '../models/PublicSubscriptionStatus';
export * from '../models/PublicSubscriptionStatusesResponse';
export * from '../models/PublicUpdateSubscriptionStatusRequest';
export * from '../models/SubscriptionDefinition';
export * from '../models/SubscriptionDefinitionsResponse';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
