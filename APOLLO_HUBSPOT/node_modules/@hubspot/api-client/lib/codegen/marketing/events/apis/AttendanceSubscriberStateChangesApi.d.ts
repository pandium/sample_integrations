import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { BatchInputMarketingEventEmailSubscriber } from '../models/BatchInputMarketingEventEmailSubscriber';
import { BatchInputMarketingEventSubscriber } from '../models/BatchInputMarketingEventSubscriber';
import { BatchResponseSubscriberEmailResponse } from '../models/BatchResponseSubscriberEmailResponse';
import { BatchResponseSubscriberVidResponse } from '../models/BatchResponseSubscriberVidResponse';
export declare class AttendanceSubscriberStateChangesApiRequestFactory extends BaseAPIRequestFactory {
    create(externalEventId: string, subscriberState: string, batchInputMarketingEventSubscriber: BatchInputMarketingEventSubscriber, externalAccountId?: string, _options?: Configuration): Promise<RequestContext>;
    createByEmail(externalEventId: string, subscriberState: string, batchInputMarketingEventEmailSubscriber: BatchInputMarketingEventEmailSubscriber, externalAccountId?: string, _options?: Configuration): Promise<RequestContext>;
}
export declare class AttendanceSubscriberStateChangesApiResponseProcessor {
    create(response: ResponseContext): Promise<BatchResponseSubscriberVidResponse>;
    createByEmail(response: ResponseContext): Promise<BatchResponseSubscriberEmailResponse>;
}
