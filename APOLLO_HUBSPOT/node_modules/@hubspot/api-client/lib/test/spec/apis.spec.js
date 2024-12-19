"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const AutomationDiscovery_1 = __importDefault(require("../../src/discovery/automation/AutomationDiscovery"));
const CmsDiscovery_1 = __importDefault(require("../../src/discovery/cms/CmsDiscovery"));
const CommunicationPreferencesDiscovery_1 = __importDefault(require("../../src/discovery/communicationPreferences/CommunicationPreferencesDiscovery"));
const ConversationsDiscovery_1 = __importDefault(require("../../src/discovery/conversations/ConversationsDiscovery"));
const CrmDiscovery_1 = __importDefault(require("../../src/discovery/crm/CrmDiscovery"));
const EventsDiscovery_1 = __importDefault(require("../../src/discovery/events/EventsDiscovery"));
const FilesDiscovery_1 = __importDefault(require("../../src/discovery/files/FilesDiscovery"));
const MarketingDiscovery_1 = __importDefault(require("../../src/discovery/marketing/MarketingDiscovery"));
const OauthDiscovery_1 = __importDefault(require("../../src/discovery/oauth/OauthDiscovery"));
const SettingsDiscovery_1 = __importDefault(require("../../src/discovery/settings/SettingsDiscovery"));
const WebhooksDiscovery_1 = __importDefault(require("../../src/discovery/webhooks/WebhooksDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client();
        expect(AutomationDiscovery_1.default.name).toBe(client.automation.constructor.name);
        expect(CmsDiscovery_1.default.name).toBe(client.cms.constructor.name);
        expect(CommunicationPreferencesDiscovery_1.default.name).toBe(client.communicationPreferences.constructor.name);
        expect(ConversationsDiscovery_1.default.name).toBe(client.conversations.constructor.name);
        expect(CrmDiscovery_1.default.name).toBe(client.crm.constructor.name);
        expect(EventsDiscovery_1.default.name).toBe(client.events.constructor.name);
        expect(FilesDiscovery_1.default.name).toBe(client.files.constructor.name);
        expect(MarketingDiscovery_1.default.name).toBe(client.marketing.constructor.name);
        expect(OauthDiscovery_1.default.name).toBe(client.oauth.constructor.name);
        expect(SettingsDiscovery_1.default.name).toBe(client.settings.constructor.name);
        expect(WebhooksDiscovery_1.default.name).toBe(client.webhooks.constructor.name);
    });
});
//# sourceMappingURL=apis.spec.js.map