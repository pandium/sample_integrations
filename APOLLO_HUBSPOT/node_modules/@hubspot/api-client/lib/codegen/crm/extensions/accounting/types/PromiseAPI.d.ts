import { Configuration } from '../configuration';
import { AccountingAppSettings } from '../models/AccountingAppSettings';
import { ActionResponse } from '../models/ActionResponse';
import { CreateUserAccountRequestExternal } from '../models/CreateUserAccountRequestExternal';
import { CustomerSearchResponseExternal } from '../models/CustomerSearchResponseExternal';
import { ExchangeRateResponse } from '../models/ExchangeRateResponse';
import { InvoiceCreatePaymentRequest } from '../models/InvoiceCreatePaymentRequest';
import { InvoicePdfResponse } from '../models/InvoicePdfResponse';
import { InvoiceReadResponse } from '../models/InvoiceReadResponse';
import { InvoiceSearchResponse } from '../models/InvoiceSearchResponse';
import { InvoiceUpdateRequest } from '../models/InvoiceUpdateRequest';
import { InvoiceUpdateResponse } from '../models/InvoiceUpdateResponse';
import { InvoicesResponseExternal } from '../models/InvoicesResponseExternal';
import { ProductSearchResponse } from '../models/ProductSearchResponse';
import { ResultIdAccountingResponse } from '../models/ResultIdAccountingResponse';
import { SyncContactsRequest } from '../models/SyncContactsRequest';
import { SyncProductsRequest } from '../models/SyncProductsRequest';
import { TaxSearchResponse } from '../models/TaxSearchResponse';
import { TermsResponse } from '../models/TermsResponse';
import { CallbacksApiRequestFactory, CallbacksApiResponseProcessor } from "../apis/CallbacksApi";
export declare class PromiseCallbacksApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CallbacksApiRequestFactory, responseProcessor?: CallbacksApiResponseProcessor);
    createCustomer(requestId: string, resultIdAccountingResponse: ResultIdAccountingResponse, _options?: Configuration): Promise<void>;
    createExchangeRate(requestId: string, exchangeRateResponse: ExchangeRateResponse, _options?: Configuration): Promise<void>;
    createInvoice(requestId: string, resultIdAccountingResponse: ResultIdAccountingResponse, _options?: Configuration): Promise<void>;
    createTerm(requestId: string, termsResponse: TermsResponse, _options?: Configuration): Promise<void>;
    doCustomerSearch(requestId: string, customerSearchResponseExternal: CustomerSearchResponseExternal, _options?: Configuration): Promise<void>;
    doInvoiceSearch(requestId: string, invoiceSearchResponse: InvoiceSearchResponse, _options?: Configuration): Promise<void>;
    doProductSearch(requestId: string, productSearchResponse: ProductSearchResponse, _options?: Configuration): Promise<void>;
    doTaxSearch(requestId: string, taxSearchResponse: TaxSearchResponse, _options?: Configuration): Promise<void>;
    getById(requestId: string, invoicesResponseExternal: InvoicesResponseExternal, _options?: Configuration): Promise<void>;
    invoicePdf(requestId: string, invoicePdfResponse: InvoicePdfResponse, _options?: Configuration): Promise<void>;
}
import { InvoiceApiRequestFactory, InvoiceApiResponseProcessor } from "../apis/InvoiceApi";
export declare class PromiseInvoiceApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: InvoiceApiRequestFactory, responseProcessor?: InvoiceApiResponseProcessor);
    createPayment(invoiceId: string, invoiceCreatePaymentRequest: InvoiceCreatePaymentRequest, accountId?: string, _options?: Configuration): Promise<InvoiceUpdateResponse>;
    getById(invoiceId: string, accountId: string, _options?: Configuration): Promise<InvoiceReadResponse>;
    update(invoiceId: string, accountId: string, invoiceUpdateRequest: InvoiceUpdateRequest, _options?: Configuration): Promise<InvoiceUpdateResponse>;
}
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class PromiseSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    getById(appId: number, _options?: Configuration): Promise<AccountingAppSettings>;
    replace(appId: number, accountingAppSettings: AccountingAppSettings, _options?: Configuration): Promise<void>;
}
import { SyncApiRequestFactory, SyncApiResponseProcessor } from "../apis/SyncApi";
export declare class PromiseSyncApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SyncApiRequestFactory, responseProcessor?: SyncApiResponseProcessor);
    createContact(appId: number, syncContactsRequest: SyncContactsRequest, _options?: Configuration): Promise<ActionResponse>;
    createProduct(appId: number, syncProductsRequest: SyncProductsRequest, _options?: Configuration): Promise<ActionResponse>;
}
import { UserAccountsApiRequestFactory, UserAccountsApiResponseProcessor } from "../apis/UserAccountsApi";
export declare class PromiseUserAccountsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: UserAccountsApiRequestFactory, responseProcessor?: UserAccountsApiResponseProcessor);
    archive(accountId: string, _options?: Configuration): Promise<void>;
    replace(createUserAccountRequestExternal: CreateUserAccountRequestExternal, _options?: Configuration): Promise<void>;
}
