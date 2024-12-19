import { MarketingEventSubscriber } from '../models/MarketingEventSubscriber';
export declare class BatchInputMarketingEventSubscriber {
    'inputs': Array<MarketingEventSubscriber>;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
        format: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
        format: string;
    }[];
    constructor();
}
