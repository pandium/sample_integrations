export * from '../models/AssociationDefinition';
export * from '../models/AssociationDefinitionEgg';
export * from '../models/CollectionResponseObjectSchemaNoPaging';
export * from '../models/ErrorDetail';
export * from '../models/ModelError';
export * from '../models/ObjectSchema';
export * from '../models/ObjectSchemaEgg';
export * from '../models/ObjectTypeDefinition';
export * from '../models/ObjectTypeDefinitionLabels';
export * from '../models/ObjectTypeDefinitionPatch';
export * from '../models/ObjectTypePropertyCreate';
export * from '../models/Option';
export * from '../models/OptionInput';
export * from '../models/Property';
export * from '../models/PropertyModificationMetadata';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
