import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CustomerSearchResponseExternal } from '../models/CustomerSearchResponseExternal';
import { ExchangeRateResponse } from '../models/ExchangeRateResponse';
import { InvoicePdfResponse } from '../models/InvoicePdfResponse';
import { InvoiceSearchResponse } from '../models/InvoiceSearchResponse';
import { InvoicesResponseExternal } from '../models/InvoicesResponseExternal';
import { ProductSearchResponse } from '../models/ProductSearchResponse';
import { ResultIdAccountingResponse } from '../models/ResultIdAccountingResponse';
import { TaxSearchResponse } from '../models/TaxSearchResponse';
import { TermsResponse } from '../models/TermsResponse';
export declare class CallbacksApiRequestFactory extends BaseAPIRequestFactory {
    createCustomer(requestId: string, resultIdAccountingResponse: ResultIdAccountingResponse, _options?: Configuration): Promise<RequestContext>;
    createExchangeRate(requestId: string, exchangeRateResponse: ExchangeRateResponse, _options?: Configuration): Promise<RequestContext>;
    createInvoice(requestId: string, resultIdAccountingResponse: ResultIdAccountingResponse, _options?: Configuration): Promise<RequestContext>;
    createTerm(requestId: string, termsResponse: TermsResponse, _options?: Configuration): Promise<RequestContext>;
    doCustomerSearch(requestId: string, customerSearchResponseExternal: CustomerSearchResponseExternal, _options?: Configuration): Promise<RequestContext>;
    doInvoiceSearch(requestId: string, invoiceSearchResponse: InvoiceSearchResponse, _options?: Configuration): Promise<RequestContext>;
    doProductSearch(requestId: string, productSearchResponse: ProductSearchResponse, _options?: Configuration): Promise<RequestContext>;
    doTaxSearch(requestId: string, taxSearchResponse: TaxSearchResponse, _options?: Configuration): Promise<RequestContext>;
    getById(requestId: string, invoicesResponseExternal: InvoicesResponseExternal, _options?: Configuration): Promise<RequestContext>;
    invoicePdf(requestId: string, invoicePdfResponse: InvoicePdfResponse, _options?: Configuration): Promise<RequestContext>;
}
export declare class CallbacksApiResponseProcessor {
    createCustomer(response: ResponseContext): Promise<void>;
    createExchangeRate(response: ResponseContext): Promise<void>;
    createInvoice(response: ResponseContext): Promise<void>;
    createTerm(response: ResponseContext): Promise<void>;
    doCustomerSearch(response: ResponseContext): Promise<void>;
    doInvoiceSearch(response: ResponseContext): Promise<void>;
    doProductSearch(response: ResponseContext): Promise<void>;
    doTaxSearch(response: ResponseContext): Promise<void>;
    getById(response: ResponseContext): Promise<void>;
    invoicePdf(response: ResponseContext): Promise<void>;
}
