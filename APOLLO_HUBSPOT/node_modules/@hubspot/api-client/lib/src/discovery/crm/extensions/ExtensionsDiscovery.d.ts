import BaseDiscovery from '../../BaseDiscovery';
import type AccountingDiscovery from './accounting/AccountingDiscovery';
import type CallingDiscovery from './calling/CallingDiscovery';
import type CardsDiscovery from './cards/CardsDiscovery';
import type VideoconferencingDiscovery from './videoconferencing/VideoconferencingDiscovery';
export default class ExtensionsDiscovery extends BaseDiscovery {
    protected _accounting: AccountingDiscovery | undefined;
    protected _calling: CallingDiscovery | undefined;
    protected _cards: CardsDiscovery | undefined;
    protected _videoconferencing: VideoconferencingDiscovery | undefined;
    get accounting(): AccountingDiscovery;
    get calling(): CallingDiscovery;
    get cards(): CardsDiscovery;
    get videoconferencing(): VideoconferencingDiscovery;
}
