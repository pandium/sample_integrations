import { EventsApi } from '../../../codegen/events/index';
import IConfiguration from '../../configuration/IConfiguration';
import BaseDiscovery from '../BaseDiscovery';
import type SendDiscovery from './send/SendDiscovery';
export default class EventsDiscovery extends BaseDiscovery {
    eventsApi: EventsApi;
    protected _send: SendDiscovery | undefined;
    constructor(config?: IConfiguration);
    get send(): SendDiscovery;
}
