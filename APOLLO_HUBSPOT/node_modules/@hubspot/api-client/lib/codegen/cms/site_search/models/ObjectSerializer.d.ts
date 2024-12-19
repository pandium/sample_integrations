export * from '../models/ContentSearchResult';
export * from '../models/ErrorDetail';
export * from '../models/IndexedData';
export * from '../models/IndexedField';
export * from '../models/ModelError';
export * from '../models/PublicSearchResults';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
