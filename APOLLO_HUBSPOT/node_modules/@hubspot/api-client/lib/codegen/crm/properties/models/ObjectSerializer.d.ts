export * from '../models/BatchInputPropertyCreate';
export * from '../models/BatchInputPropertyName';
export * from '../models/BatchReadInputPropertyName';
export * from '../models/BatchResponseProperty';
export * from '../models/BatchResponsePropertyWithErrors';
export * from '../models/CollectionResponsePropertyGroupNoPaging';
export * from '../models/CollectionResponsePropertyNoPaging';
export * from '../models/ErrorDetail';
export * from '../models/ModelError';
export * from '../models/Option';
export * from '../models/OptionInput';
export * from '../models/Property';
export * from '../models/PropertyCreate';
export * from '../models/PropertyGroup';
export * from '../models/PropertyGroupCreate';
export * from '../models/PropertyGroupUpdate';
export * from '../models/PropertyModificationMetadata';
export * from '../models/PropertyName';
export * from '../models/PropertyUpdate';
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
