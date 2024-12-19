export * from '../models/AttachToLangPrimaryRequestVNext';
export * from '../models/BatchInputJsonNode';
export * from '../models/BatchInputString';
export * from '../models/BatchInputTag';
export * from '../models/BatchResponseTag';
export * from '../models/BatchResponseTagWithErrors';
export * from '../models/CollectionResponseWithTotalTagForwardPaging';
export * from '../models/DetachFromLangGroupRequestVNext';
export * from '../models/ErrorDetail';
export * from '../models/ForwardPaging';
export * from '../models/ModelError';
export * from '../models/NextPage';
export * from '../models/SetNewLanguagePrimaryRequestVNext';
export * from '../models/StandardError';
export * from '../models/Tag';
export * from '../models/TagCloneRequestVNext';
export * from '../models/UpdateLanguagesRequestVNext';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
