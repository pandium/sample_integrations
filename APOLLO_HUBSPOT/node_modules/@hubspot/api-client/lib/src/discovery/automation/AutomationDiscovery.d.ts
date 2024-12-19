import BaseDiscovery from '../BaseDiscovery';
import type ActionsDiscovery from './actions/ActionsDiscovery';
export default class AutomationDiscovery extends BaseDiscovery {
    protected _actions: ActionsDiscovery | undefined;
    get actions(): ActionsDiscovery;
}
