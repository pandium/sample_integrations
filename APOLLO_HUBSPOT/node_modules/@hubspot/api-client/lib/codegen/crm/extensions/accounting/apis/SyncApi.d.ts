import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { ActionResponse } from '../models/ActionResponse';
import { SyncContactsRequest } from '../models/SyncContactsRequest';
import { SyncProductsRequest } from '../models/SyncProductsRequest';
export declare class SyncApiRequestFactory extends BaseAPIRequestFactory {
    createContact(appId: number, syncContactsRequest: SyncContactsRequest, _options?: Configuration): Promise<RequestContext>;
    createProduct(appId: number, syncProductsRequest: SyncProductsRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class SyncApiResponseProcessor {
    createContact(response: ResponseContext): Promise<ActionResponse>;
    createProduct(response: ResponseContext): Promise<ActionResponse>;
}
