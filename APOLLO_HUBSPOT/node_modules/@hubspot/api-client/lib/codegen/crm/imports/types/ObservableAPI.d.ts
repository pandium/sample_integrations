import { HttpFile } from '../http/http';
import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { ActionResponse } from '../models/ActionResponse';
import { CollectionResponsePublicImportErrorForwardPaging } from '../models/CollectionResponsePublicImportErrorForwardPaging';
import { CollectionResponsePublicImportResponse } from '../models/CollectionResponsePublicImportResponse';
import { PublicImportResponse } from '../models/PublicImportResponse';
import { CoreApiRequestFactory, CoreApiResponseProcessor } from "../apis/CoreApi";
export declare class ObservableCoreApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: CoreApiRequestFactory, responseProcessor?: CoreApiResponseProcessor);
    cancel(importId: number, _options?: Configuration): Observable<ActionResponse>;
    create(files?: HttpFile, importRequest?: string, _options?: Configuration): Observable<PublicImportResponse>;
    getById(importId: number, _options?: Configuration): Observable<PublicImportResponse>;
    getPage(after?: string, before?: string, limit?: number, _options?: Configuration): Observable<CollectionResponsePublicImportResponse>;
}
import { PublicImportsApiRequestFactory, PublicImportsApiResponseProcessor } from "../apis/PublicImportsApi";
export declare class ObservablePublicImportsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PublicImportsApiRequestFactory, responseProcessor?: PublicImportsApiResponseProcessor);
    getErrors(importId: number, after?: string, limit?: number, _options?: Configuration): Observable<CollectionResponsePublicImportErrorForwardPaging>;
}
