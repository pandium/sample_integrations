"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const AssociationsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/associations/AssociationsDiscovery"));
const CompaniesDiscovery_1 = __importDefault(require("../../../src/discovery/crm/companies/CompaniesDiscovery"));
const ContactsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/contacts/ContactsDiscovery"));
const DealsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/deals/DealsDiscovery"));
const ExtensionsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/extensions/ExtensionsDiscovery"));
const ImportsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/imports/ImportsDiscovery"));
const LineItemsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/line_items/LineItemsDiscovery"));
const ListsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/lists/ListsDiscovery"));
const ObjectsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/objects/ObjectsDiscovery"));
const OwnersDiscovery_1 = __importDefault(require("../../../src/discovery/crm/owners/OwnersDiscovery"));
const PipelinesDiscovery_1 = __importDefault(require("../../../src/discovery/crm/pipelines/PipelinesDiscovery"));
const ProductsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/products/ProductsDiscovery"));
const PropertiesDiscovery_1 = __importDefault(require("../../../src/discovery/crm/properties/PropertiesDiscovery"));
const QuotesDiscovery_1 = __importDefault(require("../../../src/discovery/crm/quotes/QuotesDiscovery"));
const SchemasDiscovery_1 = __importDefault(require("../../../src/discovery/crm/schemas/SchemasDiscovery"));
const TicketsDiscovery_1 = __importDefault(require("../../../src/discovery/crm/tickets/TicketsDiscovery"));
const TimelineDiscovery_1 = __importDefault(require("../../../src/discovery/crm/timeline/TimelineDiscovery"));
describe('api client', () => {
    it('is discoverable', () => {
        const client = new index_1.Client().crm;
        expect(AssociationsDiscovery_1.default.name).toBe(client.associations.constructor.name);
        expect(CompaniesDiscovery_1.default.name).toBe(client.companies.constructor.name);
        expect(ContactsDiscovery_1.default.name).toBe(client.contacts.constructor.name);
        expect(DealsDiscovery_1.default.name).toBe(client.deals.constructor.name);
        expect(ExtensionsDiscovery_1.default.name).toBe(client.extensions.constructor.name);
        expect(ImportsDiscovery_1.default.name).toBe(client.imports.constructor.name);
        expect(LineItemsDiscovery_1.default.name).toBe(client.lineItems.constructor.name);
        expect(ListsDiscovery_1.default.name).toBe(client.lists.constructor.name);
        expect(ObjectsDiscovery_1.default.name).toBe(client.objects.constructor.name);
        expect(OwnersDiscovery_1.default.name).toBe(client.owners.constructor.name);
        expect(PipelinesDiscovery_1.default.name).toBe(client.pipelines.constructor.name);
        expect(ProductsDiscovery_1.default.name).toBe(client.products.constructor.name);
        expect(PropertiesDiscovery_1.default.name).toBe(client.properties.constructor.name);
        expect(QuotesDiscovery_1.default.name).toBe(client.quotes.constructor.name);
        expect(SchemasDiscovery_1.default.name).toBe(client.schemas.constructor.name);
        expect(TicketsDiscovery_1.default.name).toBe(client.tickets.constructor.name);
        expect(TimelineDiscovery_1.default.name).toBe(client.timeline.constructor.name);
    });
});
//# sourceMappingURL=crm.spec.js.map