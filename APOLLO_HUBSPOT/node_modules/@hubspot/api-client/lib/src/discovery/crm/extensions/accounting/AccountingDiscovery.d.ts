import { CallbacksApi, InvoiceApi, SettingsApi, SyncApi, UserAccountsApi } from '../../../../../codegen/crm/extensions/accounting/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class AccountingDiscovery {
    callbacksApi: CallbacksApi;
    invoiceApi: InvoiceApi;
    settingsApi: SettingsApi;
    syncApi: SyncApi;
    userAccountsApi: UserAccountsApi;
    constructor(config: IConfiguration);
}
