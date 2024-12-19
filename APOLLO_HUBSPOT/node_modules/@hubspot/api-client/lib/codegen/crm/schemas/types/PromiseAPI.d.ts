import { Configuration } from '../configuration';
import { AssociationDefinition } from '../models/AssociationDefinition';
import { AssociationDefinitionEgg } from '../models/AssociationDefinitionEgg';
import { CollectionResponseObjectSchemaNoPaging } from '../models/CollectionResponseObjectSchemaNoPaging';
import { ObjectSchema } from '../models/ObjectSchema';
import { ObjectSchemaEgg } from '../models/ObjectSchemaEgg';
import { ObjectTypeDefinition } from '../models/ObjectTypeDefinition';
import { ObjectTypeDefinitionPatch } from '../models/ObjectTypeDefinitionPatch';
import { CoreApiRequestFactory, CoreApiResponseProcessor } from "../apis/CoreApi";
export declare class PromiseCoreApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CoreApiRequestFactory, responseProcessor?: CoreApiResponseProcessor);
    archive(objectType: string, archived?: boolean, _options?: Configuration): Promise<void>;
    archiveAssociation(objectType: string, associationIdentifier: string, _options?: Configuration): Promise<void>;
    create(objectSchemaEgg: ObjectSchemaEgg, _options?: Configuration): Promise<ObjectSchema>;
    createAssociation(objectType: string, associationDefinitionEgg: AssociationDefinitionEgg, _options?: Configuration): Promise<AssociationDefinition>;
    getAll(archived?: boolean, _options?: Configuration): Promise<CollectionResponseObjectSchemaNoPaging>;
    getById(objectType: string, _options?: Configuration): Promise<ObjectSchema>;
    update(objectType: string, objectTypeDefinitionPatch: ObjectTypeDefinitionPatch, _options?: Configuration): Promise<ObjectTypeDefinition>;
}
import { PublicObjectSchemasApiRequestFactory, PublicObjectSchemasApiResponseProcessor } from "../apis/PublicObjectSchemasApi";
export declare class PromisePublicObjectSchemasApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicObjectSchemasApiRequestFactory, responseProcessor?: PublicObjectSchemasApiResponseProcessor);
    purge(objectType: string, _options?: Configuration): Promise<void>;
}
