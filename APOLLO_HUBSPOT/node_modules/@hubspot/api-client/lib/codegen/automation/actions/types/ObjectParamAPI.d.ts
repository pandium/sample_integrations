import { Configuration } from '../configuration';
import { ActionFunction } from '../models/ActionFunction';
import { ActionFunctionIdentifier } from '../models/ActionFunctionIdentifier';
import { ActionRevision } from '../models/ActionRevision';
import { BatchInputCallbackCompletionBatchRequest } from '../models/BatchInputCallbackCompletionBatchRequest';
import { CallbackCompletionRequest } from '../models/CallbackCompletionRequest';
import { CollectionResponseActionFunctionIdentifierNoPaging } from '../models/CollectionResponseActionFunctionIdentifierNoPaging';
import { CollectionResponseActionRevisionForwardPaging } from '../models/CollectionResponseActionRevisionForwardPaging';
import { CollectionResponseExtensionActionDefinitionForwardPaging } from '../models/CollectionResponseExtensionActionDefinitionForwardPaging';
import { ExtensionActionDefinition } from '../models/ExtensionActionDefinition';
import { ExtensionActionDefinitionInput } from '../models/ExtensionActionDefinitionInput';
import { ExtensionActionDefinitionPatch } from '../models/ExtensionActionDefinitionPatch';
import { CallbacksApiRequestFactory, CallbacksApiResponseProcessor } from "../apis/CallbacksApi";
export interface CallbacksApiCompleteRequest {
    callbackId: string;
    callbackCompletionRequest: CallbackCompletionRequest;
}
export interface CallbacksApiCompleteBatchRequest {
    batchInputCallbackCompletionBatchRequest: BatchInputCallbackCompletionBatchRequest;
}
export declare class ObjectCallbacksApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CallbacksApiRequestFactory, responseProcessor?: CallbacksApiResponseProcessor);
    complete(param: CallbacksApiCompleteRequest, options?: Configuration): Promise<void>;
    completeBatch(param: CallbacksApiCompleteBatchRequest, options?: Configuration): Promise<void>;
}
import { DefinitionsApiRequestFactory, DefinitionsApiResponseProcessor } from "../apis/DefinitionsApi";
export interface DefinitionsApiArchiveRequest {
    definitionId: string;
    appId: number;
}
export interface DefinitionsApiCreateRequest {
    appId: number;
    extensionActionDefinitionInput: ExtensionActionDefinitionInput;
}
export interface DefinitionsApiGetByIdRequest {
    definitionId: string;
    appId: number;
    archived?: boolean;
}
export interface DefinitionsApiGetPageRequest {
    appId: number;
    limit?: number;
    after?: string;
    archived?: boolean;
}
export interface DefinitionsApiUpdateRequest {
    definitionId: string;
    appId: number;
    extensionActionDefinitionPatch: ExtensionActionDefinitionPatch;
}
export declare class ObjectDefinitionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: DefinitionsApiRequestFactory, responseProcessor?: DefinitionsApiResponseProcessor);
    archive(param: DefinitionsApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: DefinitionsApiCreateRequest, options?: Configuration): Promise<ExtensionActionDefinition>;
    getById(param: DefinitionsApiGetByIdRequest, options?: Configuration): Promise<ExtensionActionDefinition>;
    getPage(param: DefinitionsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseExtensionActionDefinitionForwardPaging>;
    update(param: DefinitionsApiUpdateRequest, options?: Configuration): Promise<ExtensionActionDefinition>;
}
import { FunctionsApiRequestFactory, FunctionsApiResponseProcessor } from "../apis/FunctionsApi";
export interface FunctionsApiArchiveRequest {
    definitionId: string;
    functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS';
    functionId: string;
    appId: number;
}
export interface FunctionsApiArchiveByFunctionTypeRequest {
    definitionId: string;
    functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS';
    appId: number;
}
export interface FunctionsApiCreateOrReplaceRequest {
    definitionId: string;
    functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS';
    functionId: string;
    appId: number;
    body: string;
}
export interface FunctionsApiCreateOrReplaceByFunctionTypeRequest {
    definitionId: string;
    functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS';
    appId: number;
    body: string;
}
export interface FunctionsApiGetByFunctionTypeRequest {
    definitionId: string;
    functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS';
    appId: number;
}
export interface FunctionsApiGetByIdRequest {
    definitionId: string;
    functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS';
    functionId: string;
    appId: number;
}
export interface FunctionsApiGetPageRequest {
    definitionId: string;
    appId: number;
}
export declare class ObjectFunctionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: FunctionsApiRequestFactory, responseProcessor?: FunctionsApiResponseProcessor);
    archive(param: FunctionsApiArchiveRequest, options?: Configuration): Promise<void>;
    archiveByFunctionType(param: FunctionsApiArchiveByFunctionTypeRequest, options?: Configuration): Promise<void>;
    createOrReplace(param: FunctionsApiCreateOrReplaceRequest, options?: Configuration): Promise<ActionFunctionIdentifier>;
    createOrReplaceByFunctionType(param: FunctionsApiCreateOrReplaceByFunctionTypeRequest, options?: Configuration): Promise<ActionFunctionIdentifier>;
    getByFunctionType(param: FunctionsApiGetByFunctionTypeRequest, options?: Configuration): Promise<ActionFunction>;
    getById(param: FunctionsApiGetByIdRequest, options?: Configuration): Promise<ActionFunction>;
    getPage(param: FunctionsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseActionFunctionIdentifierNoPaging>;
}
import { RevisionsApiRequestFactory, RevisionsApiResponseProcessor } from "../apis/RevisionsApi";
export interface RevisionsApiGetByIdRequest {
    definitionId: string;
    revisionId: string;
    appId: number;
}
export interface RevisionsApiGetPageRequest {
    definitionId: string;
    appId: number;
    limit?: number;
    after?: string;
}
export declare class ObjectRevisionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RevisionsApiRequestFactory, responseProcessor?: RevisionsApiResponseProcessor);
    getById(param: RevisionsApiGetByIdRequest, options?: Configuration): Promise<ActionRevision>;
    getPage(param: RevisionsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseActionRevisionForwardPaging>;
}
