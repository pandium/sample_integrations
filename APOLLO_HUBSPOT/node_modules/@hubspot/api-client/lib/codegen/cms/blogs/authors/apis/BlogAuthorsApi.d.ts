import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
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
export declare class BlogAuthorsApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    archiveBatch(batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    attachToLangGroup(attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    create(blogAuthor: BlogAuthor, _options?: Configuration): Promise<RequestContext>;
    createBatch(batchInputBlogAuthor: BatchInputBlogAuthor, _options?: Configuration): Promise<RequestContext>;
    createLangVariation(blogAuthorCloneRequestVNext: BlogAuthorCloneRequestVNext, _options?: Configuration): Promise<RequestContext>;
    detachFromLangGroup(detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext, _options?: Configuration): Promise<RequestContext>;
    getById(objectId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    readBatch(batchInputString: BatchInputString, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    setLangPrimary(setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    update(objectId: string, blogAuthor: BlogAuthor, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateBatch(batchInputJsonNode: BatchInputJsonNode, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateLangs(updateLanguagesRequestVNext: UpdateLanguagesRequestVNext, _options?: Configuration): Promise<RequestContext>;
}
export declare class BlogAuthorsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    archiveBatch(response: ResponseContext): Promise<void>;
    attachToLangGroup(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<BlogAuthor>;
    createBatch(response: ResponseContext): Promise<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>;
    createLangVariation(response: ResponseContext): Promise<BlogAuthor>;
    detachFromLangGroup(response: ResponseContext): Promise<void>;
    getById(response: ResponseContext): Promise<BlogAuthor>;
    getPage(response: ResponseContext): Promise<CollectionResponseWithTotalBlogAuthorForwardPaging>;
    readBatch(response: ResponseContext): Promise<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>;
    setLangPrimary(response: ResponseContext): Promise<void>;
    update(response: ResponseContext): Promise<BlogAuthor>;
    updateBatch(response: ResponseContext): Promise<BatchResponseBlogAuthor | BatchResponseBlogAuthorWithErrors>;
    updateLangs(response: ResponseContext): Promise<void>;
}
