import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { TimelineEventTemplateToken } from '../models/TimelineEventTemplateToken';
import { TimelineEventTemplateTokenUpdateRequest } from '../models/TimelineEventTemplateTokenUpdateRequest';
export declare class TokensApiRequestFactory extends BaseAPIRequestFactory {
    archive(eventTemplateId: string, tokenName: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(eventTemplateId: string, appId: number, timelineEventTemplateToken: TimelineEventTemplateToken, _options?: Configuration): Promise<RequestContext>;
    update(eventTemplateId: string, tokenName: string, appId: number, timelineEventTemplateTokenUpdateRequest: TimelineEventTemplateTokenUpdateRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class TokensApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<TimelineEventTemplateToken>;
    update(response: ResponseContext): Promise<TimelineEventTemplateToken>;
}
