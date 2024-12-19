import { Configuration } from '../configuration';
import { PublicSubscriptionStatus } from '../models/PublicSubscriptionStatus';
import { PublicSubscriptionStatusesResponse } from '../models/PublicSubscriptionStatusesResponse';
import { PublicUpdateSubscriptionStatusRequest } from '../models/PublicUpdateSubscriptionStatusRequest';
import { SubscriptionDefinitionsResponse } from '../models/SubscriptionDefinitionsResponse';
import { DefinitionApiRequestFactory, DefinitionApiResponseProcessor } from "../apis/DefinitionApi";
export interface DefinitionApiGetPageRequest {
}
export declare class ObjectDefinitionApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: DefinitionApiRequestFactory, responseProcessor?: DefinitionApiResponseProcessor);
    getPage(param?: DefinitionApiGetPageRequest, options?: Configuration): Promise<SubscriptionDefinitionsResponse>;
}
import { StatusApiRequestFactory, StatusApiResponseProcessor } from "../apis/StatusApi";
export interface StatusApiGetEmailStatusRequest {
    emailAddress: string;
}
export interface StatusApiSubscribeRequest {
    publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest;
}
export interface StatusApiUnsubscribeRequest {
    publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest;
}
export declare class ObjectStatusApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: StatusApiRequestFactory, responseProcessor?: StatusApiResponseProcessor);
    getEmailStatus(param: StatusApiGetEmailStatusRequest, options?: Configuration): Promise<PublicSubscriptionStatusesResponse>;
    subscribe(param: StatusApiSubscribeRequest, options?: Configuration): Promise<PublicSubscriptionStatus>;
    unsubscribe(param: StatusApiUnsubscribeRequest, options?: Configuration): Promise<PublicSubscriptionStatus>;
}
