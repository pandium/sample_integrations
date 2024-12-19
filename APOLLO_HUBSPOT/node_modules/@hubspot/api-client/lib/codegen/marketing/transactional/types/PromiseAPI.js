"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseSingleSendApi = exports.PromisePublicSmtpTokensApi = void 0;
const ObservableAPI_1 = require("./ObservableAPI");
class PromisePublicSmtpTokensApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_1.ObservablePublicSmtpTokensApi(configuration, requestFactory, responseProcessor);
    }
    archiveToken(tokenId, _options) {
        const result = this.api.archiveToken(tokenId, _options);
        return result.toPromise();
    }
    createToken(smtpApiTokenRequestEgg, _options) {
        const result = this.api.createToken(smtpApiTokenRequestEgg, _options);
        return result.toPromise();
    }
    getTokenById(tokenId, _options) {
        const result = this.api.getTokenById(tokenId, _options);
        return result.toPromise();
    }
    getTokensPage(campaignName, emailCampaignId, after, limit, _options) {
        const result = this.api.getTokensPage(campaignName, emailCampaignId, after, limit, _options);
        return result.toPromise();
    }
    resetPassword(tokenId, _options) {
        const result = this.api.resetPassword(tokenId, _options);
        return result.toPromise();
    }
}
exports.PromisePublicSmtpTokensApi = PromisePublicSmtpTokensApi;
const ObservableAPI_2 = require("./ObservableAPI");
class PromiseSingleSendApi {
    constructor(configuration, requestFactory, responseProcessor) {
        this.api = new ObservableAPI_2.ObservableSingleSendApi(configuration, requestFactory, responseProcessor);
    }
    sendEmail(publicSingleSendRequestEgg, _options) {
        const result = this.api.sendEmail(publicSingleSendRequestEgg, _options);
        return result.toPromise();
    }
}
exports.PromiseSingleSendApi = PromiseSingleSendApi;
//# sourceMappingURL=PromiseAPI.js.map