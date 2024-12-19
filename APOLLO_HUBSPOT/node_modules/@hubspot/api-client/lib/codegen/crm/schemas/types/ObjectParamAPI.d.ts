import { Configuration } from '../configuration';
import { AssociationDefinition } from '../models/AssociationDefinition';
import { AssociationDefinitionEgg } from '../models/AssociationDefinitionEgg';
import { CollectionResponseObjectSchemaNoPaging } from '../models/CollectionResponseObjectSchemaNoPaging';
import { ObjectSchema } from '../models/ObjectSchema';
import { ObjectSchemaEgg } from '../models/ObjectSchemaEgg';
import { ObjectTypeDefinition } from '../models/ObjectTypeDefinition';
import { ObjectTypeDefinitionPatch } from '../models/ObjectTypeDefinitionPatch';
import { CoreApiRequestFactory, CoreApiResponseProcessor } from "../apis/CoreApi";
export interface CoreApiArchiveRequest {
    objectType: string;
    archived?: boolean;
}
export interface CoreApiArchiveAssociationRequest {
    objectType: string;
    associationIdentifier: string;
}
export interface CoreApiCreateRequest {
    objectSchemaEgg: ObjectSchemaEgg;
}
export interface CoreApiCreateAssociationRequest {
    objectType: string;
    associationDefinitionEgg: AssociationDefinitionEgg;
}
export interface CoreApiGetAllRequest {
    archived?: boolean;
}
export interface CoreApiGetByIdRequest {
    objectType: string;
}
export interface CoreApiUpdateRequest {
    objectType: string;
    objectTypeDefinitionPatch: ObjectTypeDefinitionPatch;
}
export declare class ObjectCoreApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CoreApiRequestFactory, responseProcessor?: CoreApiResponseProcessor);
    archive(param: CoreApiArchiveRequest, options?: Configuration): Promise<void>;
    archiveAssociation(param: CoreApiArchiveAssociationRequest, options?: Configuration): Promise<void>;
    create(param: CoreApiCreateRequest, options?: Configuration): Promise<ObjectSchema>;
    createAssociation(param: CoreApiCreateAssociationRequest, options?: Configuration): Promise<AssociationDefinition>;
    getAll(param?: CoreApiGetAllRequest, options?: Configuration): Promise<CollectionResponseObjectSchemaNoPaging>;
    getById(param: CoreApiGetByIdRequest, options?: Configuration): Promise<ObjectSchema>;
    update(param: CoreApiUpdateRequest, options?: Configuration): Promise<ObjectTypeDefinition>;
}
import { PublicObjectSchemasApiRequestFactory, PublicObjectSchemasApiResponseProcessor } from "../apis/PublicObjectSchemasApi";
export interface PublicObjectSchemasApiPurgeRequest {
    objectType: string;
}
export declare class ObjectPublicObjectSchemasApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicObjectSchemasApiRequestFactory, responseProcessor?: PublicObjectSchemasApiResponseProcessor);
    purge(param: PublicObjectSchemasApiPurgeRequest, options?: Configuration): Promise<void>;
}
