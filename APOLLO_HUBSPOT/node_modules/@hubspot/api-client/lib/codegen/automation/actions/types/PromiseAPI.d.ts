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
export declare class PromiseCallbacksApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CallbacksApiRequestFactory, responseProcessor?: CallbacksApiResponseProcessor);
    complete(callbackId: string, callbackCompletionRequest: CallbackCompletionRequest, _options?: Configuration): Promise<void>;
    completeBatch(batchInputCallbackCompletionBatchRequest: BatchInputCallbackCompletionBatchRequest, _options?: Configuration): Promise<void>;
}
import { DefinitionsApiRequestFactory, DefinitionsApiResponseProcessor } from "../apis/DefinitionsApi";
export declare class PromiseDefinitionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: DefinitionsApiRequestFactory, responseProcessor?: DefinitionsApiResponseProcessor);
    archive(definitionId: string, appId: number, _options?: Configuration): Promise<void>;
    create(appId: number, extensionActionDefinitionInput: ExtensionActionDefinitionInput, _options?: Configuration): Promise<ExtensionActionDefinition>;
    getById(definitionId: string, appId: number, archived?: boolean, _options?: Configuration): Promise<ExtensionActionDefinition>;
    getPage(appId: number, limit?: number, after?: string, archived?: boolean, _options?: Configuration): Promise<CollectionResponseExtensionActionDefinitionForwardPaging>;
    update(definitionId: string, appId: number, extensionActionDefinitionPatch: ExtensionActionDefinitionPatch, _options?: Configuration): Promise<ExtensionActionDefinition>;
}
import { FunctionsApiRequestFactory, FunctionsApiResponseProcessor } from "../apis/FunctionsApi";
export declare class PromiseFunctionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: FunctionsApiRequestFactory, responseProcessor?: FunctionsApiResponseProcessor);
    archive(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', functionId: string, appId: number, _options?: Configuration): Promise<void>;
    archiveByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', appId: number, _options?: Configuration): Promise<void>;
    createOrReplace(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', functionId: string, appId: number, body: string, _options?: Configuration): Promise<ActionFunctionIdentifier>;
    createOrReplaceByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', appId: number, body: string, _options?: Configuration): Promise<ActionFunctionIdentifier>;
    getByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', appId: number, _options?: Configuration): Promise<ActionFunction>;
    getById(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', functionId: string, appId: number, _options?: Configuration): Promise<ActionFunction>;
    getPage(definitionId: string, appId: number, _options?: Configuration): Promise<CollectionResponseActionFunctionIdentifierNoPaging>;
}
import { RevisionsApiRequestFactory, RevisionsApiResponseProcessor } from "../apis/RevisionsApi";
export declare class PromiseRevisionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: RevisionsApiRequestFactory, responseProcessor?: RevisionsApiResponseProcessor);
    getById(definitionId: string, revisionId: string, appId: number, _options?: Configuration): Promise<ActionRevision>;
    getPage(definitionId: string, appId: number, limit?: number, after?: string, _options?: Configuration): Promise<CollectionResponseActionRevisionForwardPaging>;
}
