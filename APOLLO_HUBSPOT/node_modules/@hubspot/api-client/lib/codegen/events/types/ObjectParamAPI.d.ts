import { Configuration } from '../configuration';
import { CollectionResponseExternalUnifiedEvent } from '../models/CollectionResponseExternalUnifiedEvent';
import { EventsApiRequestFactory, EventsApiResponseProcessor } from "../apis/EventsApi";
export interface EventsApiGetPageRequest {
    occurredAfter?: Date;
    occurredBefore?: Date;
    objectType?: string;
    objectId?: number;
    eventType?: string;
    after?: string;
    before?: string;
    limit?: number;
    sort?: Array<string>;
}
export declare class ObjectEventsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: EventsApiRequestFactory, responseProcessor?: EventsApiResponseProcessor);
    getPage(param?: EventsApiGetPageRequest, options?: Configuration): Promise<CollectionResponseExternalUnifiedEvent>;
}
