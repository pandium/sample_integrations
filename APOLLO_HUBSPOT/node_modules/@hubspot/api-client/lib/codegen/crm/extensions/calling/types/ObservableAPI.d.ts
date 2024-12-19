import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { SettingsPatchRequest } from '../models/SettingsPatchRequest';
import { SettingsRequest } from '../models/SettingsRequest';
import { SettingsResponse } from '../models/SettingsResponse';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class ObservableSettingsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    archive(appId: number, _options?: Configuration): Observable<void>;
    create(appId: number, settingsRequest: SettingsRequest, _options?: Configuration): Observable<SettingsResponse>;
    getById(appId: number, _options?: Configuration): Observable<SettingsResponse>;
    update(appId: number, settingsPatchRequest: SettingsPatchRequest, _options?: Configuration): Observable<SettingsResponse>;
}
