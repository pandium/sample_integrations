import { HttpFile } from '../http/http';
import { Configuration } from '../configuration';
import { ActionResponse } from '../models/ActionResponse';
import { CollectionResponsePublicImportErrorForwardPaging } from '../models/CollectionResponsePublicImportErrorForwardPaging';
import { CollectionResponsePublicImportResponse } from '../models/CollectionResponsePublicImportResponse';
import { PublicImportResponse } from '../models/PublicImportResponse';
import { CoreApiRequestFactory, CoreApiResponseProcessor } from "../apis/CoreApi";
export declare class PromiseCoreApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CoreApiRequestFactory, responseProcessor?: CoreApiResponseProcessor);
    cancel(importId: number, _options?: Configuration): Promise<ActionResponse>;
    create(files?: HttpFile, importRequest?: string, _options?: Configuration): Promise<PublicImportResponse>;
    getById(importId: number, _options?: Configuration): Promise<PublicImportResponse>;
    getPage(after?: string, before?: string, limit?: number, _options?: Configuration): Promise<CollectionResponsePublicImportResponse>;
}
import { PublicImportsApiRequestFactory, PublicImportsApiResponseProcessor } from "../apis/PublicImportsApi";
export declare class PromisePublicImportsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicImportsApiRequestFactory, responseProcessor?: PublicImportsApiResponseProcessor);
    getErrors(importId: number, after?: string, limit?: number, _options?: Configuration): Promise<CollectionResponsePublicImportErrorForwardPaging>;
}
