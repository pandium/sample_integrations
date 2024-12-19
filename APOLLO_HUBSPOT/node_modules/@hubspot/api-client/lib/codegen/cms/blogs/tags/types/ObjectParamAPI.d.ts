import { Configuration } from '../configuration';
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
import { BlogTagsApiRequestFactory, BlogTagsApiResponseProcessor } from "../apis/BlogTagsApi";
export interface BlogTagsApiArchiveRequest {
    objectId: string;
    archived?: boolean;
}
export interface BlogTagsApiArchiveBatchRequest {
    batchInputString: BatchInputString;
}
export interface BlogTagsApiAttachToLangGroupRequest {
    attachToLangPrimaryRequestVNext: AttachToLangPrimaryRequestVNext;
}
export interface BlogTagsApiCreateRequest {
    tag: Tag;
}
export interface BlogTagsApiCreateBatchRequest {
    batchInputTag: BatchInputTag;
}
export interface BlogTagsApiCreateLangVariationRequest {
    tagCloneRequestVNext: TagCloneRequestVNext;
}
export interface BlogTagsApiDetachFromLangGroupRequest {
    detachFromLangGroupRequestVNext: DetachFromLangGroupRequestVNext;
}
export interface BlogTagsApiGetByIdRequest {
    objectId: string;
    archived?: boolean;
}
export interface BlogTagsApiGetPageRequest {
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
export interface BlogTagsApiReadBatchRequest {
    batchInputString: BatchInputString;
    archived?: boolean;
}
export interface BlogTagsApiSetLangPrimaryRequest {
    setNewLanguagePrimaryRequestVNext: SetNewLanguagePrimaryRequestVNext;
}
export interface BlogTagsApiUpdateRequest {
    objectId: string;
    tag: Tag;
    archived?: boolean;
}
export interface BlogTagsApiUpdateBatchRequest {
    batchInputJsonNode: BatchInputJsonNode;
    archived?: boolean;
}
export interface BlogTagsApiUpdateLangsRequest {
    updateLanguagesRequestVNext: UpdateLanguagesRequestVNext;
}
export declare class ObjectBlogTagsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: BlogTagsApiRequestFactory, responseProcessor?: BlogTagsApiResponseProcessor);
    archive(param: BlogTagsApiArchiveRequest, options?: Configuration): Promise<void>;
    archiveBatch(param: BlogTagsApiArchiveBatchRequest, options?: Configuration): Promise<void>;
    attachToLangGroup(param: BlogTagsApiAttachToLangGroupRequest, options?: Configuration): Promise<void>;
    create(param: BlogTagsApiCreateRequest, options?: Configuration): Promise<Tag>;
    createBatch(param: BlogTagsApiCreateBatchRequest, options?: Configuration): Promise<BatchResponseTag | BatchResponseTagWithErrors>;
    createLangVariation(param: BlogTagsApiCreateLangVariationRequest, options?: Configuration): Promise<Tag>;
    detachFromLangGroup(param: BlogTagsApiDetachFromLangGroupRequest, options?: Configuration): Promise<void>;
    getById(param: BlogTagsApiGetByIdRequest, options?: Configuration): Promise<Tag>;
    getPage(param?: BlogTagsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseWithTotalTagForwardPaging>;
    readBatch(param: BlogTagsApiReadBatchRequest, options?: Configuration): Promise<BatchResponseTag | BatchResponseTagWithErrors>;
    setLangPrimary(param: BlogTagsApiSetLangPrimaryRequest, options?: Configuration): Promise<void>;
    update(param: BlogTagsApiUpdateRequest, options?: Configuration): Promise<Tag>;
    updateBatch(param: BlogTagsApiUpdateBatchRequest, options?: Configuration): Promise<BatchResponseTag | BatchResponseTagWithErrors>;
    updateLangs(param: BlogTagsApiUpdateLangsRequest, options?: Configuration): Promise<void>;
}
