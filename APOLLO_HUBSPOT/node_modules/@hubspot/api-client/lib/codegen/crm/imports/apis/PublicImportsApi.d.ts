import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponsePublicImportErrorForwardPaging } from '../models/CollectionResponsePublicImportErrorForwardPaging';
export declare class PublicImportsApiRequestFactory extends BaseAPIRequestFactory {
    getErrors(importId: number, after?: string, limit?: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class PublicImportsApiResponseProcessor {
    getErrors(response: ResponseContext): Promise<CollectionResponsePublicImportErrorForwardPaging>;
}
