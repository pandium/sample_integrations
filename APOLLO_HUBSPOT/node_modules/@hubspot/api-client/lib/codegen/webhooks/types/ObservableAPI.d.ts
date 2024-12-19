import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { BatchInputSubscriptionBatchUpdateRequest } from '../models/BatchInputSubscriptionBatchUpdateRequest';
import { BatchResponseSubscriptionResponse } from '../models/BatchResponseSubscriptionResponse';
import { BatchResponseSubscriptionResponseWithErrors } from '../models/BatchResponseSubscriptionResponseWithErrors';
import { SettingsChangeRequest } from '../models/SettingsChangeRequest';
import { SettingsResponse } from '../models/SettingsResponse';
import { SubscriptionCreateRequest } from '../models/SubscriptionCreateRequest';
import { SubscriptionListResponse } from '../models/SubscriptionListResponse';
import { SubscriptionPatchRequest } from '../models/SubscriptionPatchRequest';
import { SubscriptionResponse } from '../models/SubscriptionResponse';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class ObservableSettingsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    clear(appId: number, _options?: Configuration): Observable<void>;
    configure(appId: number, settingsChangeRequest: SettingsChangeRequest, _options?: Configuration): Observable<SettingsResponse>;
    getAll(appId: number, _options?: Configuration): Observable<SettingsResponse>;
}
import { SubscriptionsApiRequestFactory, SubscriptionsApiResponseProcessor } from "../apis/SubscriptionsApi";
export declare class ObservableSubscriptionsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SubscriptionsApiRequestFactory, responseProcessor?: SubscriptionsApiResponseProcessor);
    archive(subscriptionId: number, appId: number, _options?: Configuration): Observable<void>;
    create(appId: number, subscriptionCreateRequest: SubscriptionCreateRequest, _options?: Configuration): Observable<SubscriptionResponse>;
    getAll(appId: number, _options?: Configuration): Observable<SubscriptionListResponse>;
    getById(subscriptionId: number, appId: number, _options?: Configuration): Observable<SubscriptionResponse>;
    update(subscriptionId: number, appId: number, subscriptionPatchRequest: SubscriptionPatchRequest, _options?: Configuration): Observable<SubscriptionResponse>;
    updateBatch(appId: number, batchInputSubscriptionBatchUpdateRequest: BatchInputSubscriptionBatchUpdateRequest, _options?: Configuration): Observable<BatchResponseSubscriptionResponse | BatchResponseSubscriptionResponseWithErrors>;
}
