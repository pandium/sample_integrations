import { Configuration } from '../configuration';
import { CollectionResponseExternalUnifiedEvent } from '../models/CollectionResponseExternalUnifiedEvent';
import { EventsApiRequestFactory, EventsApiResponseProcessor } from "../apis/EventsApi";
export declare class PromiseEventsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: EventsApiRequestFactory, responseProcessor?: EventsApiResponseProcessor);
    getPage(occurredAfter?: Date, occurredBefore?: Date, objectType?: string, objectId?: number, eventType?: string, after?: string, before?: string, limit?: number, sort?: Array<string>, _options?: Configuration): Promise<CollectionResponseExternalUnifiedEvent>;
}
