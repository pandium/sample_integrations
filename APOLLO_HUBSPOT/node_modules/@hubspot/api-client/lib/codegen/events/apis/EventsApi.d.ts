import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseExternalUnifiedEvent } from '../models/CollectionResponseExternalUnifiedEvent';
export declare class EventsApiRequestFactory extends BaseAPIRequestFactory {
    getPage(occurredAfter?: Date, occurredBefore?: Date, objectType?: string, objectId?: number, eventType?: string, after?: string, before?: string, limit?: number, sort?: Array<string>, _options?: Configuration): Promise<RequestContext>;
}
export declare class EventsApiResponseProcessor {
    getPage(response: ResponseContext): Promise<CollectionResponseExternalUnifiedEvent>;
}
