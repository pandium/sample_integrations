import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { AttachToLangPrimaryRequestVNext } from '../models/AttachToLangPrimaryRequestVNext';
import { BatchInputJsonNode } from '../models/BatchInputJsonNode';
import { BatchInputString } from '../models/BatchInputString';
import { BatchInputTag } from '../models/BatchInputTag';
import { BatchResponseTag } from '../models/BatchResponseTag';
import { BatchResponseTagWithErrors } from '../models/BatchResponseTagWithErrors';
import { CollectionResponseWithTotalTagForwardPaging } from '../models/CollectionResponseWithTotalTagForwardPaging';
import { DetachFromLangGroupRequestVNext } from '../models/DetachFromLangGroupRequestVNext';
import { SetNewLanguagePrimaryRequestVNext } from '../models/SetNewLanguagePrimaryRequestVNext';
import { Tag } from '../models/Tag';
import { TagCloneRequestVNext } from '../models/TagCloneRequestVNext';
import { UpdateLanguagesRequestVNext } from '../models/UpdateLanguagesRequestVNext';
export declare class BlogTagsApiRequestFactory extends BaseAPIRequestFactory {
    archive(objectId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    archiveBatch(batchInputString: BatchInputString, _options?: Configuration): Promise<RequestContext>;
    attachToLangGroup(attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    create(tag: Tag, _options?: Configuration): Promise<RequestContext>;
    createBatch(batchInputTag: BatchInputTag, _options?: Configuration): Promise<RequestContext>;
    createLangVariation(tagCloneRequestVNext: TagCloneRequestVNext, _options?: Configuration): Promise<RequestContext>;
    detachFromLangGroup(detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext, _options?: Configuration): Promise<RequestContext>;
    getById(objectId: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(createdAt?: Date, createdAfter?: Date, createdBefore?: Date, updatedAt?: Date, updatedAfter?: Date, updatedBefore?: Date, sort?: Array<string>, after?: string, limit?: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    readBatch(batchInputString: BatchInputString, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    setLangPrimary(setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext, _options?: Configuration): Promise<RequestContext>;
    update(objectId: string, tag: Tag, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateBatch(batchInputJsonNode: BatchInputJsonNode, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    updateLangs(updateLanguagesRequestVNext: UpdateLanguagesRequestVNext, _options?: Configuration): Promise<RequestContext>;
}
export declare class BlogTagsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    archiveBatch(response: ResponseContext): Promise<void>;
    attachToLangGroup(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<Tag>;
    createBatch(response: ResponseContext): Promise<BatchResponseTag | BatchResponseTagWithErrors>;
    createLangVariation(response: ResponseContext): Promise<Tag>;
    detachFromLangGroup(response: ResponseContext): Promise<void>;
    getById(response: ResponseContext): Promise<Tag>;
    getPage(response: ResponseContext): Promise<CollectionResponseWithTotalTagForwardPaging>;
    readBatch(response: ResponseContext): Promise<BatchResponseTag | BatchResponseTagWithErrors>;
    setLangPrimary(response: ResponseContext): Promise<void>;
    update(response: ResponseContext): Promise<Tag>;
    updateBatch(response: ResponseContext): Promise<BatchResponseTag | BatchResponseTagWithErrors>;
    updateLangs(response: ResponseContext): Promise<void>;
}
