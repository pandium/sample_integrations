import { MarketingEventEmailSubscriber } from '../models/MarketingEventEmailSubscriber';
export declare class BatchInputMarketingEventEmailSubscriber {
    'inputs': Array<MarketingEventEmailSubscriber>;
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
