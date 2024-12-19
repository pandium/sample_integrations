import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { AssociationDefinition } from '../models/AssociationDefinition';
import { AssociationDefinitionEgg } from '../models/AssociationDefinitionEgg';
import { CollectionResponseObjectSchemaNoPaging } from '../models/CollectionResponseObjectSchemaNoPaging';
import { ObjectSchema } from '../models/ObjectSchema';
import { ObjectSchemaEgg } from '../models/ObjectSchemaEgg';
import { ObjectTypeDefinition } from '../models/ObjectTypeDefinition';
import { ObjectTypeDefinitionPatch } from '../models/ObjectTypeDefinitionPatch';
export declare class CoreApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectType: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    archiveAssociation(objectType: string, associationIdentifier: string, _options?: Configuration): Promise<RequestContext>;
    create(objectSchemaEgg: ObjectSchemaEgg, _options?: Configuration): Promise<RequestContext>;
    createAssociation(objectType: string, associationDefinitionEgg: AssociationDefinitionEgg, _options?: Configuration): Promise<RequestContext>;
    getAll(archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getById(objectType: string, _options?: Configuration): Promise<RequestContext>;
    update(objectType: string, objectTypeDefinitionPatch: ObjectTypeDefinitionPatch, _options?: Configuration): Promise<RequestContext>;
}
export declare class CoreApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    archiveAssociation(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<ObjectSchema>;
    createAssociation(response: ResponseContext): Promise<AssociationDefinition>;
    getAll(response: ResponseContext): Promise<CollectionResponseObjectSchemaNoPaging>;
    getById(response: ResponseContext): Promise<ObjectSchema>;
    update(response: ResponseContext): Promise<ObjectTypeDefinition>;
}
