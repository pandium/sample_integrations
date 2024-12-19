export * from '../models/AssociatedId';
export * from '../models/BatchInputPublicAssociation';
export * from '../models/BatchInputPublicObjectId';
export * from '../models/BatchResponsePublicAssociation';
export * from '../models/BatchResponsePublicAssociationMulti';
export * from '../models/BatchResponsePublicAssociationMultiWithErrors';
export * from '../models/BatchResponsePublicAssociationWithErrors';
export * from '../models/CollectionResponsePublicAssociationDefinitionNoPaging';
export * from '../models/ErrorCategory';
export * from '../models/ErrorDetail';
export * from '../models/ModelError';
export * from '../models/NextPage';
export * from '../models/Paging';
export * from '../models/PreviousPage';
export * from '../models/PublicAssociation';
export * from '../models/PublicAssociationDefinition';
export * from '../models/PublicAssociationMulti';
export * from '../models/PublicObjectId';
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
