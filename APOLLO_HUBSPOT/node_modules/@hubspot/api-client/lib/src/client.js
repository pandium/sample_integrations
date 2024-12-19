"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const ApiDecoratorService_1 = __importDefault(require("./services/ApiDecoratorService"));
const LimiterDecorator_1 = __importDefault(require("./services/decorators/LimiterDecorator"));
const RetryDecorator_1 = __importDefault(require("./services/decorators/RetryDecorator"));
const HttpClient_1 = require("./services/http/HttpClient");
const Request_1 = require("./services/http/Request");
class Client {
    constructor(config = {}) {
        this.config = config;
        this.init();
    }
    init() {
        ApiDecoratorService_1.default.getInstance().setDecorators(this.getDecorators());
        this._automation = undefined;
        this._cms = undefined;
        this._communicationPreferences = undefined;
        this._conversations = undefined;
        this._crm = undefined;
        this._events = undefined;
        this._files = undefined;
        this._marketing = undefined;
        this._oauth = undefined;
        this._settings = undefined;
        this._webhooks = undefined;
    }
    get automation() {
        if (!this._automation) {
            const requiredClass = require('./discovery/automation/AutomationDiscovery');
            this._automation = new requiredClass.default(this.config);
        }
        return this._automation;
    }
    get cms() {
        if (!this._cms) {
            const requiredClass = require('./discovery/cms/CmsDiscovery');
            this._cms = new requiredClass.default(this.config);
        }
        return this._cms;
    }
    get communicationPreferences() {
        if (!this._communicationPreferences) {
            const requiredClass = require('./discovery/communicationPreferences/CommunicationPreferencesDiscovery');
            this._communicationPreferences = new requiredClass.default(this.config);
        }
        return this._communicationPreferences;
    }
    get conversations() {
        if (!this._conversations) {
            const requiredClass = require('./discovery/conversations/ConversationsDiscovery');
            this._conversations = new requiredClass.default(this.config);
        }
        return this._conversations;
    }
    get crm() {
        if (!this._crm) {
            const requiredClass = require('./discovery/crm/CrmDiscovery');
            this._crm = new requiredClass.default(this.config);
        }
        return this._crm;
    }
    get events() {
        if (!this._events) {
            const requiredClass = require('./discovery/events/EventsDiscovery');
            this._events = new requiredClass.default(this.config);
        }
        return this._events;
    }
    get files() {
        if (!this._files) {
            const requiredClass = require('./discovery/files/FilesDiscovery');
            this._files = new requiredClass.default(this.config);
        }
        return this._files;
    }
    get marketing() {
        if (!this._marketing) {
            const requiredClass = require('./discovery/marketing/MarketingDiscovery');
            this._marketing = new requiredClass.default(this.config);
        }
        return this._marketing;
    }
    get oauth() {
        if (!this._oauth) {
            const requiredClass = require('./discovery/oauth/OauthDiscovery');
            this._oauth = new requiredClass.default(this.config);
        }
        return this._oauth;
    }
    get settings() {
        if (!this._settings) {
            const requiredClass = require('./discovery/settings/SettingsDiscovery');
            this._settings = new requiredClass.default(this.config);
        }
        return this._settings;
    }
    get webhooks() {
        if (!this._webhooks) {
            const requiredClass = require('./discovery/webhooks/WebhooksDiscovery');
            this._webhooks = new requiredClass.default(this.config);
        }
        return this._webhooks;
    }
    setAccessToken(token) {
        this.config.accessToken = token;
        this.init();
    }
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this.init();
    }
    setDeveloperApiKey(developerApiKey) {
        this.config.developerApiKey = developerApiKey;
        this.init();
    }
    apiRequest(opts = {}) {
        const request = new Request_1.Request(this.config, opts);
        let { send } = HttpClient_1.HttpClient;
        send = ApiDecoratorService_1.default.getInstance().applyToMethod(send);
        return send(request);
    }
    getDecorators() {
        const decorators = new Array();
        if (this.config.limiterOptions) {
            decorators.push(new LimiterDecorator_1.default(this.config.limiterOptions, this.config.limiterJobOptions));
        }
        if (this.config.numberOfApiCallRetries && this.config.numberOfApiCallRetries > 0) {
            if (this.config.numberOfApiCallRetries > 6) {
                throw new Error('numberOfApiCallRetries can be set to a number from 0 - 6.');
            }
            decorators.push(new RetryDecorator_1.default(this.config.numberOfApiCallRetries));
        }
        return decorators;
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map