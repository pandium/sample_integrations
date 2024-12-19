import { Configuration } from '../configuration';
import { AttachToLangPrimaryRequestVNext } from '../models/AttachToLangPrimaryRequestVNext';
import { BatchInputBlogPost } from '../models/BatchInputBlogPost';
import { BatchInputJsonNode } from '../models/BatchInputJsonNode';
import { BatchInputString } from '../models/BatchInputString';
import { BatchResponseBlogPost } from '../models/BatchResponseBlogPost';
import { BatchResponseBlogPostWithErrors } from '../models/BatchResponseBlogPostWithErrors';
import { BlogPost } from '../models/BlogPost';
import { BlogPostLanguageCloneRequestVNext } from '../models/BlogPostLanguageCloneRequestVNext';
import { CollectionResponseWithTotalBlogPostForwardPaging } from '../models/CollectionResponseWithTotalBlogPostForwardPaging';
import { CollectionResponseWithTotalVersionBlogPost } from '../models/CollectionResponseWithTotalVersionBlogPost';
import { ContentCloneRequestVNext } from '../models/ContentCloneRequestVNext';
import { ContentScheduleRequestVNext } from '../models/ContentScheduleRequestVNext';
import { DetachFromLangGroupRequestVNext } from '../models/DetachFromLangGroupRequestVNext';
import { SetNewLanguagePrimaryRequestVNext } from '../models/SetNewLanguagePrimaryRequestVNext';
import { UpdateLanguagesRequestVNext } from '../models/UpdateLanguagesRequestVNext';
import { VersionBlogPost } from '../models/VersionBlogPost';
import { BlogPostsApiRequestFactory, BlogPostsApiResponseProcessor } from "../apis/BlogPostsApi";
export interface BlogPostsApiArchiveRequest {
    objectId: string;
    archived?: boolean;
}
export interface BlogPostsApiArchiveBatchRequest {
    batchInputString: BatchInputString;
}
export interface BlogPostsApiAttachToLangGroupRequest {
    attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext;
}
export interface BlogPostsApiCloneRequest {
    contentCloneRequestVNext: ContentCloneRequestVNext;
}
export interface BlogPostsApiCreateRequest {
    blogPost: BlogPost;
}
export interface BlogPostsApiCreateBatchRequest {
    batchInputBlogPost: BatchInputBlogPost;
}
export interface BlogPostsApiCreateLangVariationRequest {
    blogPostLanguageCloneRequestVNext: BlogPostLanguageCloneRequestVNext;
}
export interface BlogPostsApiDetachFromLangGroupRequest {
    detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext;
}
export interface BlogPostsApiGetByIdRequest {
    objectId: string;
    archived?: boolean;
}
export interface BlogPostsApiGetDraftByIdRequest {
    objectId: string;
}
export interface BlogPostsApiGetPageRequest {
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
export interface BlogPostsApiGetPreviousVersionRequest {
    objectId: string;
    revisionId: string;
}
export interface BlogPostsApiGetPreviousVersionsRequest {
    objectId: string;
    after?: string;
    before?: string;
    limit?: number;
}
export interface BlogPostsApiPushLiveRequest {
    objectId: string;
}
export interface BlogPostsApiReadBatchRequest {
    batchInputString: BatchInputString;
    archived?: boolean;
}
export interface BlogPostsApiResetDraftRequest {
    objectId: string;
}
export interface BlogPostsApiRestorePreviousVersionRequest {
    objectId: string;
    revisionId: string;
}
export interface BlogPostsApiRestorePreviousVersionToDraftRequest {
    objectId: string;
    revisionId: number;
}
export interface BlogPostsApiScheduleRequest {
    contentScheduleRequestVNext: ContentScheduleRequestVNext;
}
export interface BlogPostsApiSetLangPrimaryRequest {
    setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext;
}
export interface BlogPostsApiUpdateRequest {
    objectId: string;
    blogPost: BlogPost;
    archived?: boolean;
}
export interface BlogPostsApiUpdateBatchRequest {
    batchInputJsonNode: BatchInputJsonNode;
    archived?: boolean;
}
export interface BlogPostsApiUpdateDraftRequest {
    objectId: string;
    blogPost: BlogPost;
}
export interface BlogPostsApiUpdateLangsRequest {
    updateLanguagesRequestVNext: UpdateLanguagesRequestVNext;
}
export declare class ObjectBlogPostsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: BlogPostsApiRequestFactory, responseProcessor?: BlogPostsApiResponseProcessor);
    archive(param: BlogPostsApiArchiveRequest, options?: Configuration): Promise<void>;
    archiveBatch(param: BlogPostsApiArchiveBatchRequest, options?: Configuration): Promise<void>;
    attachToLangGroup(param: BlogPostsApiAttachToLangGroupRequest, options?: Configuration): Promise<void>;
    clone(param: BlogPostsApiCloneRequest, options?: Configuration): Promise<BlogPost>;
    create(param: BlogPostsApiCreateRequest, options?: Configuration): Promise<BlogPost>;
    createBatch(param: BlogPostsApiCreateBatchRequest, options?: Configuration): Promise<BatchResponseBlogPostWithErrors | BatchResponseBlogPost>;
    createLangVariation(param: BlogPostsApiCreateLangVariationRequest, options?: Configuration): Promise<BlogPost>;
    detachFromLangGroup(param: BlogPostsApiDetachFromLangGroupRequest, options?: Configuration): Promise<void>;
    getById(param: BlogPostsApiGetByIdRequest, options?: Configuration): Promise<BlogPost>;
    getDraftById(param: BlogPostsApiGetDraftByIdRequest, options?: Configuration): Promise<BlogPost>;
    getPage(param?: BlogPostsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseWithTotalBlogPostForwardPaging>;
    getPreviousVersion(param: BlogPostsApiGetPreviousVersionRequest, options?: Configuration): Promise<VersionBlogPost>;
    getPreviousVersions(param: BlogPostsApiGetPreviousVersionsRequest, options?: Configuration): Promise<CollectionResponseWithTotalVersionBlogPost>;
    pushLive(param: BlogPostsApiPushLiveRequest, options?: Configuration): Promise<void>;
    readBatch(param: BlogPostsApiReadBatchRequest, options?: Configuration): Promise<BatchResponseBlogPostWithErrors | BatchResponseBlogPost>;
    resetDraft(param: BlogPostsApiResetDraftRequest, options?: Configuration): Promise<void>;
    restorePreviousVersion(param: BlogPostsApiRestorePreviousVersionRequest, options?: Configuration): Promise<BlogPost>;
    restorePreviousVersionToDraft(param: BlogPostsApiRestorePreviousVersionToDraftRequest, options?: Configuration): Promise<BlogPost>;
    schedule(param: BlogPostsApiScheduleRequest, options?: Configuration): Promise<void>;
    setLangPrimary(param: BlogPostsApiSetLangPrimaryRequest, options?: Configuration): Promise<void>;
    update(param: BlogPostsApiUpdateRequest, options?: Configuration): Promise<BlogPost>;
    updateBatch(param: BlogPostsApiUpdateBatchRequest, options?: Configuration): Promise<BatchResponseBlogPostWithErrors | BatchResponseBlogPost>;
    updateDraft(param: BlogPostsApiUpdateDraftRequest, options?: Configuration): Promise<BlogPost>;
    updateLangs(param: BlogPostsApiUpdateLangsRequest, options?: Configuration): Promise<void>;
}
