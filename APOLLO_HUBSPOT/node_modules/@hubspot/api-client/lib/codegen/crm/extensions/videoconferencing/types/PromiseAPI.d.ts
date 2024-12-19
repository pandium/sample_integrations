import { Configuration } from '../configuration';
import { ExternalSettings } from '../models/ExternalSettings';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class PromiseSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    archive(appId: number, _options?: Configuration): Promise<void>;
    getById(appId: number, _options?: Configuration): Promise<ExternalSettings>;
    replace(appId: number, externalSettings: ExternalSettings, _options?: Configuration): Promise<ExternalSettings>;
}
