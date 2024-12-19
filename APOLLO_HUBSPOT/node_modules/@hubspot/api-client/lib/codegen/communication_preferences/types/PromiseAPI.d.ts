import { Configuration } from '../configuration';
import { PublicSubscriptionStatus } from '../models/PublicSubscriptionStatus';
import { PublicSubscriptionStatusesResponse } from '../models/PublicSubscriptionStatusesResponse';
import { PublicUpdateSubscriptionStatusRequest } from '../models/PublicUpdateSubscriptionStatusRequest';
import { SubscriptionDefinitionsResponse } from '../models/SubscriptionDefinitionsResponse';
import { DefinitionApiRequestFactory, DefinitionApiResponseProcessor } from "../apis/DefinitionApi";
export declare class PromiseDefinitionApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: DefinitionApiRequestFactory, responseProcessor?: DefinitionApiResponseProcessor);
    getPage(_options?: Configuration): Promise<SubscriptionDefinitionsResponse>;
}
import { StatusApiRequestFactory, StatusApiResponseProcessor } from "../apis/StatusApi";
export declare class PromiseStatusApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: StatusApiRequestFactory, responseProcessor?: StatusApiResponseProcessor);
    getEmailStatus(emailAddress: string, _options?: Configuration): Promise<PublicSubscriptionStatusesResponse>;
    subscribe(publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest, _options?: Configuration): Promise<PublicSubscriptionStatus>;
    unsubscribe(publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest, _options?: Configuration): Promise<PublicSubscriptionStatus>;
}
