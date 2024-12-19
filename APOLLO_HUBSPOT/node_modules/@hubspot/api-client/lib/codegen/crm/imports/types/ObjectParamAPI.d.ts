import { HttpFile } from '../http/http';
import { Configuration } from '../configuration';
import { ActionResponse } from '../models/ActionResponse';
import { CollectionResponsePublicImportErrorForwardPaging } from '../models/CollectionResponsePublicImportErrorForwardPaging';
import { CollectionResponsePublicImportResponse } from '../models/CollectionResponsePublicImportResponse';
import { PublicImportResponse } from '../models/PublicImportResponse';
import { CoreApiRequestFactory, CoreApiResponseProcessor } from "../apis/CoreApi";
export interface CoreApiCancelRequest {
    importId: number;
}
export interface CoreApiCreateRequest {
    files?: HttpFile;
    importRequest?: string;
}
export interface CoreApiGetByIdRequest {
    importId: number;
}
export interface CoreApiGetPageRequest {
    after?: string;
    before?: string;
    limit?: number;
}
export declare class ObjectCoreApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CoreApiRequestFactory, responseProcessor?: CoreApiResponseProcessor);
    cancel(param: CoreApiCancelRequest, options?: Configuration): Promise<ActionResponse>;
    create(param?: CoreApiCreateRequest, options?: Configuration): Promise<PublicImportResponse>;
    getById(param: CoreApiGetByIdRequest, options?: Configuration): Promise<PublicImportResponse>;
    getPage(param?: CoreApiGetPageRequest, options?: Configuration): Promise<CollectionResponsePublicImportResponse>;
}
import { PublicImportsApiRequestFactory, PublicImportsApiResponseProcessor } from "../apis/PublicImportsApi";
export interface PublicImportsApiGetErrorsRequest {
    importId: number;
    after?: string;
    limit?: number;
}
export declare class ObjectPublicImportsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicImportsApiRequestFactory, responseProcessor?: PublicImportsApiResponseProcessor);
    getErrors(param: PublicImportsApiGetErrorsRequest, options?: Configuration): Promise<CollectionResponsePublicImportErrorForwardPaging>;
}
