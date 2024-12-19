import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
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
export declare class ObservableCallbacksApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: CallbacksApiRequestFactory, responseProcessor?: CallbacksApiResponseProcessor);
    createCustomer(requestId: string, resultIdAccountingResponse: ResultIdAccountingResponse, _options?: Configuration): Observable<void>;
    createExchangeRate(requestId: string, exchangeRateResponse: ExchangeRateResponse, _options?: Configuration): Observable<void>;
    createInvoice(requestId: string, resultIdAccountingResponse: ResultIdAccountingResponse, _options?: Configuration): Observable<void>;
    createTerm(requestId: string, termsResponse: TermsResponse, _options?: Configuration): Observable<void>;
    doCustomerSearch(requestId: string, customerSearchResponseExternal: CustomerSearchResponseExternal, _options?: Configuration): Observable<void>;
    doInvoiceSearch(requestId: string, invoiceSearchResponse: InvoiceSearchResponse, _options?: Configuration): Observable<void>;
    doProductSearch(requestId: string, productSearchResponse: ProductSearchResponse, _options?: Configuration): Observable<void>;
    doTaxSearch(requestId: string, taxSearchResponse: TaxSearchResponse, _options?: Configuration): Observable<void>;
    getById(requestId: string, invoicesResponseExternal: InvoicesResponseExternal, _options?: Configuration): Observable<void>;
    invoicePdf(requestId: string, invoicePdfResponse: InvoicePdfResponse, _options?: Configuration): Observable<void>;
}
import { InvoiceApiRequestFactory, InvoiceApiResponseProcessor } from "../apis/InvoiceApi";
export declare class ObservableInvoiceApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: InvoiceApiRequestFactory, responseProcessor?: InvoiceApiResponseProcessor);
    createPayment(invoiceId: string, invoiceCreatePaymentRequest: InvoiceCreatePaymentRequest, accountId?: string, _options?: Configuration): Observable<InvoiceUpdateResponse>;
    getById(invoiceId: string, accountId: string, _options?: Configuration): Observable<InvoiceReadResponse>;
    update(invoiceId: string, accountId: string, invoiceUpdateRequest: InvoiceUpdateRequest, _options?: Configuration): Observable<InvoiceUpdateResponse>;
}
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export declare class ObservableSettingsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    getById(appId: number, _options?: Configuration): Observable<AccountingAppSettings>;
    replace(appId: number, accountingAppSettings: AccountingAppSettings, _options?: Configuration): Observable<void>;
}
import { SyncApiRequestFactory, SyncApiResponseProcessor } from "../apis/SyncApi";
export declare class ObservableSyncApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SyncApiRequestFactory, responseProcessor?: SyncApiResponseProcessor);
    createContact(appId: number, syncContactsRequest: SyncContactsRequest, _options?: Configuration): Observable<ActionResponse>;
    createProduct(appId: number, syncProductsRequest: SyncProductsRequest, _options?: Configuration): Observable<ActionResponse>;
}
import { UserAccountsApiRequestFactory, UserAccountsApiResponseProcessor } from "../apis/UserAccountsApi";
export declare class ObservableUserAccountsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: UserAccountsApiRequestFactory, responseProcessor?: UserAccountsApiResponseProcessor);
    archive(accountId: string, _options?: Configuration): Observable<void>;
    replace(createUserAccountRequestExternal: CreateUserAccountRequestExternal, _options?: Configuration): Observable<void>;
}
