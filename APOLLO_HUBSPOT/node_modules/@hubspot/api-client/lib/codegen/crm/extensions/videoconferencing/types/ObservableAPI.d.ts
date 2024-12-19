import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { ExternalSettings } from '../models/ExternalSettings';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class ObservableSettingsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    archive(appId: number, _options?: Configuration): Observable<void>;
    getById(appId: number, _options?: Configuration): Observable<ExternalSettings>;
    replace(appId: number, externalSettings: ExternalSettings, _options?: Configuration): Observable<ExternalSettings>;
}
