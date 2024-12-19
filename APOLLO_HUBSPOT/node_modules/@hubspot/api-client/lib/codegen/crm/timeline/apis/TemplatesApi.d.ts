import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseTimelineEventTemplateNoPaging } from '../models/CollectionResponseTimelineEventTemplateNoPaging';
import { TimelineEventTemplate } from '../models/TimelineEventTemplate';
import { TimelineEventTemplateCreateRequest } from '../models/TimelineEventTemplateCreateRequest';
import { TimelineEventTemplateUpdateRequest } from '../models/TimelineEventTemplateUpdateRequest';
export declare class TemplatesApiRequestFactory extends BaseAPIRequestFactory {
    archive(eventTemplateId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, timelineEventTemplateCreateRequest: TimelineEventTemplateCreateRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(eventTemplateId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    update(eventTemplateId: string, appId: number, timelineEventTemplateUpdateRequest: TimelineEventTemplateUpdateRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class TemplatesApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<TimelineEventTemplate>;
    getAll(response: ResponseContext): Promise<CollectionResponseTimelineEventTemplateNoPaging>;
    getById(response: ResponseContext): Promise<TimelineEventTemplate>;
    update(response: ResponseContext): Promise<TimelineEventTemplate>;
}
