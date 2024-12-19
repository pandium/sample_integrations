"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSingleSendApi = exports.ObjectPublicSmtpTokensApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class ObjectPublicSmtpTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicSmtpTokensApi(configuration, requestFactory, responseProcessor);
    }
    archiveToken(param, options) {
        return this.api.archiveToken(param.tokenId, options).toPromise();
    }
    createToken(param, options) {
        return this.api.createToken(param.smtpApiTokenRequestEgg, options).toPromise();
    }
    getTokenById(param, options) {
        return this.api.getTokenById(param.tokenId, options).toPromise();
    }
    getTokensPage(param = {}, options) {
        return this.api.getTokensPage(param.campaignName, param.emailCampaignId, param.after, param.limit, options).toPromise();
    }
    resetPassword(param, options) {
        return this.api.resetPassword(param.tokenId, options).toPromise();
    }
}
exports.ObjectPublicSmtpTokensApi = ObjectPublicSmtpTokensApi;
const ObservableAPI_2 = require("./ObservableAPI");
class ObjectSingleSendApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSingleSendApi(configuration, requestFactory, responseProcessor);
    }
    sendEmail(param, options) {
        return this.api.sendEmail(param.publicSingleSendRequestEgg, options).toPromise();
    }
}
exports.ObjectSingleSendApi = ObjectSingleSendApi;
//# sourceMappingURL=ObjectParamAPI.js.map