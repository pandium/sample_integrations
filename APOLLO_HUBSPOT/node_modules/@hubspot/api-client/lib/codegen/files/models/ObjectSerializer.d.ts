export * from '../models/CollectionResponseFile';
export * from '../models/CollectionResponseFolder';
export * from '../models/ErrorDetail';
export * from '../models/FileActionResponse';
export * from '../models/FileStat';
export * from '../models/FileUpdateInput';
export * from '../models/Folder';
export * from '../models/FolderActionResponse';
export * from '../models/FolderInput';
export * from '../models/FolderUpdateInput';
export * from '../models/FolderUpdateTaskLocator';
export * from '../models/ImportFromUrlInput';
export * from '../models/ImportFromUrlTaskLocator';
export * from '../models/ModelError';
export * from '../models/ModelFile';
export * from '../models/NextPage';
export * from '../models/Paging';
export * from '../models/PreviousPage';
export * from '../models/SignedUrl';
export * from '../models/StandardError';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
