import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { InvoiceCreatePaymentRequest } from '../models/InvoiceCreatePaymentRequest';
import { InvoiceReadResponse } from '../models/InvoiceReadResponse';
import { InvoiceUpdateRequest } from '../models/InvoiceUpdateRequest';
import { InvoiceUpdateResponse } from '../models/InvoiceUpdateResponse';
export declare class InvoiceApiRequestFactory extends BaseAPIRequestFactory {
    createPayment(invoiceId: string, invoiceCreatePaymentRequest: InvoiceCreatePaymentRequest, accountId?: string, _options?: Configuration): Promise<RequestContext>;
    getById(invoiceId: string, accountId: string, _options?: Configuration): Promise<RequestContext>;
    update(invoiceId: string, accountId: string, invoiceUpdateRequest: InvoiceUpdateRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class InvoiceApiResponseProcessor {
    createPayment(response: ResponseContext): Promise<InvoiceUpdateResponse>;
    getById(response: ResponseContext): Promise<InvoiceReadResponse>;
    update(response: ResponseContext): Promise<InvoiceUpdateResponse>;
}
