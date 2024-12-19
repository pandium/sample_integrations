export * from '../models/ActionResponse';
export * from '../models/AssetFileMetadata';
export * from '../models/ErrorDetail';
export * from '../models/FileExtractRequest';
export * from '../models/ModelError';
export * from '../models/TaskLocator';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
