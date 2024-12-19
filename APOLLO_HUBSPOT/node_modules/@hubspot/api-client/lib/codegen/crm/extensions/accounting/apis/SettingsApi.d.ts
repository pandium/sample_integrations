import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { AccountingAppSettings } from '../models/AccountingAppSettings';
export declare class SettingsApiRequestFactory extends BaseAPIRequestFactory {
    getById(appId: number, _options?: Configuration): Promise<RequestContext>;
    replace(appId: number, accountingAppSettings: AccountingAppSettings, _options?: Configuration): Promise<RequestContext>;
}
export declare class SettingsApiResponseProcessor {
    getById(response: ResponseContext): Promise<AccountingAppSettings>;
    replace(response: ResponseContext): Promise<void>;
}
