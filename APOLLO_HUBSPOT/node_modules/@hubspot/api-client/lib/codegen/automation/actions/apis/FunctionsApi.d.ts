import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { ActionFunction } from '../models/ActionFunction';
import { ActionFunctionIdentifier } from '../models/ActionFunctionIdentifier';
import { CollectionResponseActionFunctionIdentifierNoPaging } from '../models/CollectionResponseActionFunctionIdentifierNoPaging';
export declare class FunctionsApiRequestFactory extends BaseAPIRequestFactory {
    archive(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', functionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    archiveByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', appId: number, _options?: Configuration): Promise<RequestContext>;
    createOrReplace(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', functionId: string, appId: number, body: string, _options?: Configuration): Promise<RequestContext>;
    createOrReplaceByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', appId: number, body: string, _options?: Configuration): Promise<RequestContext>;
    getByFunctionType(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(definitionId: string, functionType: 'PRE_ACTION_EXECUTION' | 'PRE_FETCH_OPTIONS' | 'POST_FETCH_OPTIONS', functionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    getPage(definitionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class FunctionsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    archiveByFunctionType(response: ResponseContext): Promise<void>;
    createOrReplace(response: ResponseContext): Promise<ActionFunctionIdentifier>;
    createOrReplaceByFunctionType(response: ResponseContext): Promise<ActionFunctionIdentifier>;
    getByFunctionType(response: ResponseContext): Promise<ActionFunction>;
    getById(response: ResponseContext): Promise<ActionFunction>;
    getPage(response: ResponseContext): Promise<CollectionResponseActionFunctionIdentifierNoPaging>;
}
