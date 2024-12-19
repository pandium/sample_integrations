import { Configuration } from '../configuration';
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
export interface SettingsApiClearRequest {
    appId: number;
}
export interface SettingsApiConfigureRequest {
    appId: number;
    settingsChangeRequest: SettingsChangeRequest;
}
export interface SettingsApiGetAllRequest {
    appId: number;
}
export declare class ObjectSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    clear(param: SettingsApiClearRequest, options?: Configuration): Promise<void>;
    configure(param: SettingsApiConfigureRequest, options?: Configuration): Promise<SettingsResponse>;
    getAll(param: SettingsApiGetAllRequest, options?: Configuration): Promise<SettingsResponse>;
}
import { SubscriptionsApiRequestFactory, SubscriptionsApiResponseProcessor } from "../apis/SubscriptionsApi";
export interface SubscriptionsApiArchiveRequest {
    subscriptionId: number;
    appId: number;
}
export interface SubscriptionsApiCreateRequest {
    appId: number;
    subscriptionCreateRequest: SubscriptionCreateRequest;
}
export interface SubscriptionsApiGetAllRequest {
    appId: number;
}
export interface SubscriptionsApiGetByIdRequest {
    subscriptionId: number;
    appId: number;
}
export interface SubscriptionsApiUpdateRequest {
    subscriptionId: number;
    appId: number;
    subscriptionPatchRequest: SubscriptionPatchRequest;
}
export interface SubscriptionsApiUpdateBatchRequest {
    appId: number;
    batchInputSubscriptionBatchUpdateRequest: BatchInputSubscriptionBatchUpdateRequest;
}
export declare class ObjectSubscriptionsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SubscriptionsApiRequestFactory, responseProcessor?: SubscriptionsApiResponseProcessor);
    archive(param: SubscriptionsApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: SubscriptionsApiCreateRequest, options?: Configuration): Promise<SubscriptionResponse>;
    getAll(param: SubscriptionsApiGetAllRequest, options?: Configuration): Promise<SubscriptionListResponse>;
    getById(param: SubscriptionsApiGetByIdRequest, options?: Configuration): Promise<SubscriptionResponse>;
    update(param: SubscriptionsApiUpdateRequest, options?: Configuration): Promise<SubscriptionResponse>;
    updateBatch(param: SubscriptionsApiUpdateBatchRequest, options?: Configuration): Promise<BatchResponseSubscriptionResponse | BatchResponseSubscriptionResponseWithErrors>;
}
