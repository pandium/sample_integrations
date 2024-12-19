import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { AssociationDefinition } from '../models/AssociationDefinition';
import { AssociationDefinitionEgg } from '../models/AssociationDefinitionEgg';
import { CollectionResponseObjectSchemaNoPaging } from '../models/CollectionResponseObjectSchemaNoPaging';
import { ObjectSchema } from '../models/ObjectSchema';
import { ObjectSchemaEgg } from '../models/ObjectSchemaEgg';
import { ObjectTypeDefinition } from '../models/ObjectTypeDefinition';
import { ObjectTypeDefinitionPatch } from '../models/ObjectTypeDefinitionPatch';
import { CoreApiRequestFactory, CoreApiResponseProcessor } from "../apis/CoreApi";
export declare class ObservableCoreApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: CoreApiRequestFactory, responseProcessor?: CoreApiResponseProcessor);
    archive(objectType: string, archived?: boolean, _options?: Configuration): Observable<void>;
    archiveAssociation(objectType: string, associationIdentifier: string, _options?: Configuration): Observable<void>;
    create(objectSchemaEgg: ObjectSchemaEgg, _options?: Configuration): Observable<ObjectSchema>;
    createAssociation(objectType: string, associationDefinitionEgg: AssociationDefinitionEgg, _options?: Configuration): Observable<AssociationDefinition>;
    getAll(archived?: boolean, _options?: Configuration): Observable<CollectionResponseObjectSchemaNoPaging>;
    getById(objectType: string, _options?: Configuration): Observable<ObjectSchema>;
    update(objectType: string, objectTypeDefinitionPatch: ObjectTypeDefinitionPatch, _options?: Configuration): Observable<ObjectTypeDefinition>;
}
import { PublicObjectSchemasApiRequestFactory, PublicObjectSchemasApiResponseProcessor } from "../apis/PublicObjectSchemasApi";
export declare class ObservablePublicObjectSchemasApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PublicObjectSchemasApiRequestFactory, responseProcessor?: PublicObjectSchemasApiResponseProcessor);
    purge(objectType: string, _options?: Configuration): Observable<void>;
}
