import GorgiasClient from '@pandium/gorgias-client';
import IterableClient from '@pandium/iterable-client';
import { Config } from '../lib.js';
export declare const syncGorgiasCustomersToIterableUsers: (gorgias: GorgiasClient, iterable: IterableClient, config: Config) => Promise<void>;
