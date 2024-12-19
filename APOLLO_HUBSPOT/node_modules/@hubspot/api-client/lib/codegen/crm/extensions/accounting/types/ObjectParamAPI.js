"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUserAccountsApi = exports.ObjectSyncApi = exports.ObjectSettingsApi = exports.ObjectInvoiceApi = exports.ObjectCallbacksApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectCallbacksApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservableCallbacksApi(configuration, requestFactory, responseProcessor);
    }
    createCustomer(param, options) {
        return this.api.createCustomer(param.requestId, param.resultIdAccountingResponse, options).toPromise();
    }
    createExchangeRate(param, options) {
        return this.api.createExchangeRate(param.requestId, param.exchangeRateResponse, options).toPromise();
    }
    createInvoice(param, options) {
        return this.api.createInvoice(param.requestId, param.resultIdAccountingResponse, options).toPromise();
    }
    createTerm(param, options) {
        return this.api.createTerm(param.requestId, param.termsResponse, options).toPromise();
    }
    doCustomerSearch(param, options) {
        return this.api.doCustomerSearch(param.requestId, param.customerSearchResponseExternal, options).toPromise();
    }
    doInvoiceSearch(param, options) {
        return this.api.doInvoiceSearch(param.requestId, param.invoiceSearchResponse, options).toPromise();
    }
    doProductSearch(param, options) {
        return this.api.doProductSearch(param.requestId, param.productSearchResponse, options).toPromise();
    }
    doTaxSearch(param, options) {
        return this.api.doTaxSearch(param.requestId, param.taxSearchResponse, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.requestId, param.invoicesResponseExternal, options).toPromise();
    }
    invoicePdf(param, options) {
        return this.api.invoicePdf(param.requestId, param.invoicePdfResponse, options).toPromise();
    }
}
exports.ObjectCallbacksApi = ObjectCallbacksApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectInvoiceApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableInvoiceApi(configuration, requestFactory, responseProcessor);
    }
    createPayment(param, options) {
        return this.api.createPayment(param.invoiceId, param.invoiceCreatePaymentRequest, param.accountId, options).toPromise();
    }
    getById(param, options) {
        return this.api.getById(param.invoiceId, param.accountId, options).toPromise();
    }
    update(param, options) {
        return this.api.update(param.invoiceId, param.accountId, param.invoiceUpdateRequest, options).toPromise();
    }
}
exports.ObjectInvoiceApi = ObjectInvoiceApi;
const ObservableAPI_3 = require("./ObservableAPI");
class ObjectSettingsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_3.ObservableSettingsApi(configuration, requestFactory, responseProcessor);
    }
    getById(param, options) {
        return this.api.getById(param.appId, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.appId, param.accountingAppSettings, options).toPromise();
    }
}
exports.ObjectSettingsApi = ObjectSettingsApi;
const ObservableAPI_4 = require("./ObservableAPI");
class ObjectSyncApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_4.ObservableSyncApi(configuration, requestFactory, responseProcessor);
    }
    createContact(param, options) {
        return this.api.createContact(param.appId, param.syncContactsRequest, options).toPromise();
    }
    createProduct(param, options) {
        return this.api.createProduct(param.appId, param.syncProductsRequest, options).toPromise();
    }
}
exports.ObjectSyncApi = ObjectSyncApi;
const ObservableAPI_5 = require("./ObservableAPI");
class ObjectUserAccountsApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_5.ObservableUserAccountsApi(configuration, requestFactory, responseProcessor);
    }
    archive(param, options) {
        return this.api.archive(param.accountId, options).toPromise();
    }
    replace(param, options) {
        return this.api.replace(param.createUserAccountRequestExternal, options).toPromise();
    }
}
exports.ObjectUserAccountsApi = ObjectUserAccountsApi;
//# sourceMappingURL=ObjectParamAPI.js.map