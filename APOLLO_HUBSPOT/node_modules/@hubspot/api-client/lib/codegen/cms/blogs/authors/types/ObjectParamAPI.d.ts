import { Configuration } from '../configuration';
import { AttachToLangPrimaryRequestVNext } from '../models/AttachToLangPrimaryRequestVNext';
import { BatchInputBlogAuthor } from '../models/BatchInputBlogAuthor';
import { BatchInputJsonNode } from '../models/BatchInputJsonNode';
import { BatchInputString } from '../models/BatchInputString';
import { BatchResponseBlogAuthor } from '../models/BatchResponseBlogAuthor';
import { BatchResponseBlogAuthorWithErrors } from '../models/BatchResponseBlogAuthorWithErrors';
import { BlogAuthor } from '../models/BlogAuthor';
import { BlogAuthorCloneRequestVNext } from '../models/BlogAuthorCloneRequestVNext';
import { CollectionResponseWithTotalBlogAuthorForwardPaging } from '../models/CollectionResponseWithTotalBlogAuthorForwardPaging';
import { DetachFromLangGroupRequestVNext } from '../models/DetachFromLangGroupRequestVNext';
import { SetNewLanguagePrimaryRequestVNext } from '../models/SetNewLanguagePrimaryRequestVNext';
import { UpdateLanguagesRequestVNext } from '../models/UpdateLanguagesRequestVNext';
import { BlogAuthorsApiRequestFactory, BlogAuthorsApiResponseProcessor } from "../apis/BlogAuthorsApi";
export interface BlogAuthorsApiArchiveRequest {
    objectId: string;
    archived?: boolean;
}
export interface BlogAuthorsApiArchiveBatchRequest {
    batchInputString: BatchInputString;
}
export interface BlogAuthorsApiAttachToLangGroupRequest {
    attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext;
}
export interface BlogAuthorsApiCreateRequest {
    blogAuthor: BlogAuthor;
}
export interface BlogAuthorsApiCreateBatchRequest {
    batchInputBlogAuthor: BatchInputBlogAuthor;
}
export interface BlogAuthorsApiCreateLangVariationRequest {
    blogAuthorCloneRequestVNext: BlogAuthorCloneRequestVNext;
}
export interface BlogAuthorsApiDetachFromLangGroupRequest {
    detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext;
}
export interface BlogAuthorsApiGetByIdRequest {
    objectId: string;
    archived?: boolean;
}
export interface BlogAuthorsApiGetPageRequest {
    createdAt?: Date;
    createdAfter?: Date;
    createdBefore?: Date;
    updatedAt?: Date;
    updatedAfter?: Date;
    updatedBefore?: Date;
    sort?: Array<string>;
    after?: string;
    limit?: number;
    archived?: boolean;
}
export interface BlogAuthorsApiReadBatchRequest {
    batchInputString: BatchInputString;
    archived?: boolean;
}
export interface BlogAuthorsApiSetLangPrimaryRequest {
    setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext;
}
export interface BlogAuthorsApiUpdateRequest {
    objectId: string;
    blogAuthor: BlogAuthor;
    archived?: boolean;
}
export interface BlogAuthorsApiUpdateBatchRequest {
    batchInputJsonNode: BatchInputJsonNode;
    archived?: boolean;
}
export interface BlogAuthorsApiUpdateLangsRequest {
    updateLanguagesRequestVNext: UpdateLanguagesRequestVNext;
}
export declare class ObjectBlogAuthorsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: BlogAuthorsApiRequestFactory, responseProcessor?: BlogAuthorsApiResponseProcessor);
    archive(param: BlogAuthorsApiArchiveRequest, options?: Configuration): Promise<void>;
    archiveBatch(param: BlogAuthorsApiArchiveBatchRequest, options?: Configuration): Promise<void>;
    attachToLangGroup(param: BlogAuthorsApiAttachToLangGroupRequest, options?: Configuration): Promise<void>;
    create(param: BlogAuthorsApiCreateRequest, options?: Configuration): Promise<BlogAuthor>;
    createBatch(param: BlogAuthorsApiCreateBatchRequest, options?: Configuration): Promise<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>;
    createLangVariation(param: BlogAuthorsApiCreateLangVariationRequest, options?: Configuration): Promise<BlogAuthor>;
    detachFromLangGroup(param: BlogAuthorsApiDetachFromLangGroupRequest, options?: Configuration): Promise<void>;
    getById(param: BlogAuthorsApiGetByIdRequest, options?: Configuration): Promise<BlogAuthor>;
    getPage(param?: BlogAuthorsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseWithTotalBlogAuthorForwardPaging>;
    readBatch(param: BlogAuthorsApiReadBatchRequest, options?: Configuration): Promise<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>;
    setLangPrimary(param: BlogAuthorsApiSetLangPrimaryRequest, options?: Configuration): Promise<void>;
    update(param: BlogAuthorsApiUpdateRequest, options?: Configuration): Promise<BlogAuthor>;
    updateBatch(param: BlogAuthorsApiUpdateBatchRequest, options?: Configuration): Promise<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>;
    updateLangs(param: BlogAuthorsApiUpdateLangsRequest, options?: Configuration): Promise<void>;
}
