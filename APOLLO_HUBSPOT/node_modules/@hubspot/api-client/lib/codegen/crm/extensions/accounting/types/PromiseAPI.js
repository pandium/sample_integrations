"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseUserAccountsApi = exports.PromiseSyncApi = exports.PromiseSettingsApi = exports.PromiseInvoiceApi = exports.PromiseCallbacksApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromiseCallbacksApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCallbacksApi(configuration, requestFactory, responseProcessor);
    }
    createCustomer(requestId, resultIdAccountingResponse, _options) {
        const result = this.api.createCustomer(requestId, resultIdAccountingResponse, _options);
        return result.toPromise();
    }
    createExchangeRate(requestId, exchangeRateResponse, _options) {
        const result = this.api.createExchangeRate(requestId, exchangeRateResponse, _options);
        return result.toPromise();
    }
    createInvoice(requestId, resultIdAccountingResponse, _options) {
        const result = this.api.createInvoice(requestId, resultIdAccountingResponse, _options);
        return result.toPromise();
    }
    createTerm(requestId, termsResponse, _options) {
        const result = this.api.createTerm(requestId, termsResponse, _options);
        return result.toPromise();
    }
    doCustomerSearch(requestId, customerSearchResponseExternal, _options) {
        const result = this.api.doCustomerSearch(requestId, customerSearchResponseExternal, _options);
        return result.toPromise();
    }
    doInvoiceSearch(requestId, invoiceSearchResponse, _options) {
        const result = this.api.doInvoiceSearch(requestId, invoiceSearchResponse, _options);
        return result.toPromise();
    }
    doProductSearch(requestId, productSearchResponse, _options) {
        const result = this.api.doProductSearch(requestId, productSearchResponse, _options);
        return result.toPromise();
    }
    doTaxSearch(requestId, taxSearchResponse, _options) {
        const result = this.api.doTaxSearch(requestId, taxSearchResponse, _options);
        return result.toPromise();
    }
    getById(requestId, invoicesResponseExternal, _options) {
        const result = this.api.getById(requestId, invoicesResponseExternal, _options);
        return result.toPromise();
    }
    invoicePdf(requestId, invoicePdfResponse, _options) {
        const result = this.api.invoicePdf(requestId, invoicePdfResponse, _options);
        return result.toPromise();
    }
}
exports.PromiseCallbacksApi = PromiseCallbacksApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseInvoiceApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableInvoiceApi(configuration, requestFactory, responseProcessor);
    }
    createPayment(invoiceId, invoiceCreatePaymentRequest, accountId, _options) {
        const result = this.api.createPayment(invoiceId, invoiceCreatePaymentRequest, accountId, _options);
        return result.toPromise();
    }
    getById(invoiceId, accountId, _options) {
        const result = this.api.getById(invoiceId, accountId, _options);
        return result.toPromise();
    }
    update(invoiceId, accountId, invoiceUpdateRequest, _options) {
        const result = this.api.update(invoiceId, accountId, invoiceUpdateRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseInvoiceApi = PromiseInvoiceApi;
const ObservableAPI_3 = require("./ObservableAPI");
class PromiseSettingsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableSettingsApi(configuration, requestFactory, responseProcessor);
    }
    getById(appId, _options) {
        const result = this.api.getById(appId, _options);
        return result.toPromise();
    }
    replace(appId, accountingAppSettings, _options) {
        const result = this.api.replace(appId, accountingAppSettings, _options);
        return result.toPromise();
    }
}
exports.PromiseSettingsApi = PromiseSettingsApi;
const ObservableAPI_4 = require("./ObservableAPI");
class PromiseSyncApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableSyncApi(configuration, requestFactory, responseProcessor);
    }
    createContact(appId, syncContactsRequest, _options) {
        const result = this.api.createContact(appId, syncContactsRequest, _options);
        return result.toPromise();
    }
    createProduct(appId, syncProductsRequest, _options) {
        const result = this.api.createProduct(appId, syncProductsRequest, _options);
        return result.toPromise();
    }
}
exports.PromiseSyncApi = PromiseSyncApi;
const ObservableAPI_5 = require("./ObservableAPI");
class PromiseUserAccountsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_5.ObservableUserAccountsApi(configuration, requestFactory, responseProcessor);
    }
    archive(accountId, _options) {
        const result = this.api.archive(accountId, _options);
        return result.toPromise();
    }
    replace(createUserAccountRequestExternal, _options) {
        const result = this.api.replace(createUserAccountRequestExternal, _options);
        return result.toPromise();
    }
}
exports.PromiseUserAccountsApi = PromiseUserAccountsApi;
//# sourceMappingURL=PromiseAPI.js.map