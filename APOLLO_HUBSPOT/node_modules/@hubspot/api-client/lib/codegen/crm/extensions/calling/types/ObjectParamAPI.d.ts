import { Configuration } from '../configuration';
import { SettingsPatchRequest } from '../models/SettingsPatchRequest';
import { SettingsRequest } from '../models/SettingsRequest';
import { SettingsResponse } from '../models/SettingsResponse';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export interface SettingsApiArchiveRequest {
    appId: number;
}
export interface SettingsApiCreateRequest {
    appId: number;
    settingsRequest: SettingsRequest;
}
export interface SettingsApiGetByIdRequest {
    appId: number;
}
export interface SettingsApiUpdateRequest {
    appId: number;
    settingsPatchRequest: SettingsPatchRequest;
}
export declare class ObjectSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    archive(param: SettingsApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: SettingsApiCreateRequest, options?: Configuration): Promise<SettingsResponse>;
    getById(param: SettingsApiGetByIdRequest, options?: Configuration): Promise<SettingsResponse>;
    update(param: SettingsApiUpdateRequest, options?: Configuration): Promise<SettingsResponse>;
}
