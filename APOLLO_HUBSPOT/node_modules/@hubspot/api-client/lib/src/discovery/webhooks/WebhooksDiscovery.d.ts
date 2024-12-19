import { SettingsApi, SubscriptionsApi } from '../../../codegen/webhooks/index';
import IConfiguration from '../../configuration/IConfiguration';
export default class WebhooksDiscovery {
    settingsApi: SettingsApi;
    subscriptionsApi: SubscriptionsApi;
    constructor(config?: IConfiguration);
}
