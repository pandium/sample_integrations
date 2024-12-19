import BaseDiscovery from '../BaseDiscovery';
import type VisitorIdentificationDiscovery from './visitor_identification/VisitorIdentificationDiscovery';
export default class ConversationsDiscovery extends BaseDiscovery {
    protected _visitorIdentification: VisitorIdentificationDiscovery | undefined;
    get visitorIdentification(): VisitorIdentificationDiscovery;
}
