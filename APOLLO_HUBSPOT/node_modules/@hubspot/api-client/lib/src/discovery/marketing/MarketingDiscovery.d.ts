import BaseDiscovery from '../BaseDiscovery';
import type EventsDiscovery from './events/EventsDiscovery';
import type FormsDiscovery from './forms/FormsDiscovery';
import type TransactionalDiscovery from './transactional/TransactionalDiscovery';
export default class MarketingDiscovery extends BaseDiscovery {
    protected _events: EventsDiscovery | undefined;
    protected _forms: FormsDiscovery | undefined;
    protected _transactional: TransactionalDiscovery | undefined;
    get events(): EventsDiscovery;
    get forms(): FormsDiscovery;
    get transactional(): TransactionalDiscovery;
}
