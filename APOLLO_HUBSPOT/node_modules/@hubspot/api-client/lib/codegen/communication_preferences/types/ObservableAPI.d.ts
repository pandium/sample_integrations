import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { PublicSubscriptionStatus } from '../models/PublicSubscriptionStatus';
import { PublicSubscriptionStatusesResponse } from '../models/PublicSubscriptionStatusesResponse';
import { PublicUpdateSubscriptionStatusRequest } from '../models/PublicUpdateSubscriptionStatusRequest';
import { SubscriptionDefinitionsResponse } from '../models/SubscriptionDefinitionsResponse';
import { DefinitionApiRequestFactory, DefinitionApiResponseProcessor } from "../apis/DefinitionApi";
export declare class ObservableDefinitionApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: DefinitionApiRequestFactory, responseProcessor?: DefinitionApiResponseProcessor);
    getPage(_options?: Configuration): Observable<SubscriptionDefinitionsResponse>;
}
import { StatusApiRequestFactory, StatusApiResponseProcessor } from "../apis/StatusApi";
export declare class ObservableStatusApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: StatusApiRequestFactory, responseProcessor?: StatusApiResponseProcessor);
    getEmailStatus(emailAddress: string, _options?: Configuration): Observable<PublicSubscriptionStatusesResponse>;
    subscribe(publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest, _options?: Configuration): Observable<PublicSubscriptionStatus>;
    unsubscribe(publicUpdateSubscriptionStatusRequest: PublicUpdateSubscriptionStatusRequest, _options?: Configuration): Observable<PublicSubscriptionStatus>;
}
