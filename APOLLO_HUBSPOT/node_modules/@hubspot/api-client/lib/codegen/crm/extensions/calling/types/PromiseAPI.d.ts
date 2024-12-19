import { Configuration } from '../configuration';
import { SettingsPatchRequest } from '../models/SettingsPatchRequest';
import { SettingsRequest } from '../models/SettingsRequest';
import { SettingsResponse } from '../models/SettingsResponse';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class PromiseSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    archive(appId: number, _options?: Configuration): Promise<void>;
    create(appId: number, settingsRequest: SettingsRequest, _options?: Configuration): Promise<SettingsResponse>;
    getById(appId: number, _options?: Configuration): Promise<SettingsResponse>;
    update(appId: number, settingsPatchRequest: SettingsPatchRequest, _options?: Configuration): Promise<SettingsResponse>;
}
