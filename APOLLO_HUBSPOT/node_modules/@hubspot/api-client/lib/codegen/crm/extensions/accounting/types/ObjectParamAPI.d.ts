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
export interface CallbacksApiCreateCustomerRequest {
    requestId: string;
    resultIdAccountingResponse: ResultIdAccountingResponse;
}
export interface CallbacksApiCreateExchangeRateRequest {
    requestId: string;
    exchangeRateResponse: ExchangeRateResponse;
}
export interface CallbacksApiCreateInvoiceRequest {
    requestId: string;
    resultIdAccountingResponse: ResultIdAccountingResponse;
}
export interface CallbacksApiCreateTermRequest {
    requestId: string;
    termsResponse: TermsResponse;
}
export interface CallbacksApiDoCustomerSearchRequest {
    requestId: string;
    customerSearchResponseExternal: CustomerSearchResponseExternal;
}
export interface CallbacksApiDoInvoiceSearchRequest {
    requestId: string;
    invoiceSearchResponse: InvoiceSearchResponse;
}
export interface CallbacksApiDoProductSearchRequest {
    requestId: string;
    productSearchResponse: ProductSearchResponse;
}
export interface CallbacksApiDoTaxSearchRequest {
    requestId: string;
    taxSearchResponse: TaxSearchResponse;
}
export interface CallbacksApiGetByIdRequest {
    requestId: string;
    invoicesResponseExternal: InvoicesResponseExternal;
}
export interface CallbacksApiInvoicePdfRequest {
    requestId: string;
    invoicePdfResponse: InvoicePdfResponse;
}
export declare class ObjectCallbacksApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CallbacksApiRequestFactory, responseProcessor?: CallbacksApiResponseProcessor);
    createCustomer(param: CallbacksApiCreateCustomerRequest, options?: Configuration): Promise<void>;
    createExchangeRate(param: CallbacksApiCreateExchangeRateRequest, options?: Configuration): Promise<void>;
    createInvoice(param: CallbacksApiCreateInvoiceRequest, options?: Configuration): Promise<void>;
    createTerm(param: CallbacksApiCreateTermRequest, options?: Configuration): Promise<void>;
    doCustomerSearch(param: CallbacksApiDoCustomerSearchRequest, options?: Configuration): Promise<void>;
    doInvoiceSearch(param: CallbacksApiDoInvoiceSearchRequest, options?: Configuration): Promise<void>;
    doProductSearch(param: CallbacksApiDoProductSearchRequest, options?: Configuration): Promise<void>;
    doTaxSearch(param: CallbacksApiDoTaxSearchRequest, options?: Configuration): Promise<void>;
    getById(param: CallbacksApiGetByIdRequest, options?: Configuration): Promise<void>;
    invoicePdf(param: CallbacksApiInvoicePdfRequest, options?: Configuration): Promise<void>;
}
import { InvoiceApiRequestFactory, InvoiceApiResponseProcessor } from "../apis/InvoiceApi";
export interface InvoiceApiCreatePaymentRequest {
    invoiceId: string;
    invoiceCreatePaymentRequest: InvoiceCreatePaymentRequest;
    accountId?: string;
}
export interface InvoiceApiGetByIdRequest {
    invoiceId: string;
    accountId: string;
}
export interface InvoiceApiUpdateRequest {
    invoiceId: string;
    accountId: string;
    invoiceUpdateRequest: InvoiceUpdateRequest;
}
export declare class ObjectInvoiceApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: InvoiceApiRequestFactory, responseProcessor?: InvoiceApiResponseProcessor);
    createPayment(param: InvoiceApiCreatePaymentRequest, options?: Configuration): Promise<InvoiceUpdateResponse>;
    getById(param: InvoiceApiGetByIdRequest, options?: Configuration): Promise<InvoiceReadResponse>;
    update(param: InvoiceApiUpdateRequest, options?: Configuration): Promise<InvoiceUpdateResponse>;
}
import { SettingsApiRequestFactory, SettingsApiResponseProcessor } from "../apis/SettingsApi";
export interface SettingsApiGetByIdRequest {
    appId: number;
}
export interface SettingsApiReplaceRequest {
    appId: number;
    accountingAppSettings: AccountingAppSettings;
}
export declare class ObjectSettingsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SettingsApiRequestFactory, responseProcessor?: SettingsApiResponseProcessor);
    getById(param: SettingsApiGetByIdRequest, options?: Configuration): Promise<AccountingAppSettings>;
    replace(param: SettingsApiReplaceRequest, options?: Configuration): Promise<void>;
}
import { SyncApiRequestFactory, SyncApiResponseProcessor } from "../apis/SyncApi";
export interface SyncApiCreateContactRequest {
    appId: number;
    syncContactsRequest: SyncContactsRequest;
}
export interface SyncApiCreateProductRequest {
    appId: number;
    syncProductsRequest: SyncProductsRequest;
}
export declare class ObjectSyncApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SyncApiRequestFactory, responseProcessor?: SyncApiResponseProcessor);
    createContact(param: SyncApiCreateContactRequest, options?: Configuration): Promise<ActionResponse>;
    createProduct(param: SyncApiCreateProductRequest, options?: Configuration): Promise<ActionResponse>;
}
import { UserAccountsApiRequestFactory, UserAccountsApiResponseProcessor } from "../apis/UserAccountsApi";
export interface UserAccountsApiArchiveRequest {
    accountId: string;
}
export interface UserAccountsApiReplaceRequest {
    createUserAccountRequestExternal: CreateUserAccountRequestExternal;
}
export declare class ObjectUserAccountsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: UserAccountsApiRequestFactory, responseProcessor?: UserAccountsApiResponseProcessor);
    archive(param: UserAccountsApiArchiveRequest, options?: Configuration): Promise<void>;
    replace(param: UserAccountsApiReplaceRequest, options?: Configuration): Promise<void>;
}
