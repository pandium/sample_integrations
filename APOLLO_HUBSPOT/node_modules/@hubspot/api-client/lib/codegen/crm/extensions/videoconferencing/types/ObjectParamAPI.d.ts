import { Configuration } from '../configuration';
import { ExternalSettings } from '../models/ExternalSettings';
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export interface SettingsApiArchiveRequest {
    appId: number;
}
export interface SettingsApiGetByIdRequest {
    appId: number;
}
export interface SettingsApiReplaceRequest {
    appId: number;
    externalSettings: ExternalSettings;
}
export declare class ObjectSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    archive(param: SettingsApiArchiveRequest, options?: Configuration): Promise<void>;
    getById(param: SettingsApiGetByIdRequest, options?: Configuration): Promise<ExternalSettings>;
    replace(param: SettingsApiReplaceRequest, options?: Configuration): Promise<ExternalSettings>;
}
