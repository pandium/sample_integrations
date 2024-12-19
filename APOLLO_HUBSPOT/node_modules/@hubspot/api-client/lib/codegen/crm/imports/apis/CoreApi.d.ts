import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile } from '../http/http';
import { ActionResponse } from '../models/ActionResponse';
import { CollectionResponsePublicImportResponse } from '../models/CollectionResponsePublicImportResponse';
import { PublicImportResponse } from '../models/PublicImportResponse';
export declare class CoreApiRequestFactory extends BaseAPIRequestFactory {
    cancel(importId: number, _options?: Configuration): Promise<RequestContext>;
    create(files?: HttpFile, importRequest?: string, _options?: Configuration): Promise<RequestContext>;
    getById(importId: number, _options?: Configuration): Promise<RequestContext>;
    getPage(after?: string, before?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class CoreApiResponseProcessor {
    cancel(response: ResponseContext): Promise<ActionResponse>;
    create(response: ResponseContext): Promise<PublicImportResponse>;
    getById(response: ResponseContext): Promise<PublicImportResponse>;
    getPage(response: ResponseContext): Promise<CollectionResponsePublicImportResponse>;
}
