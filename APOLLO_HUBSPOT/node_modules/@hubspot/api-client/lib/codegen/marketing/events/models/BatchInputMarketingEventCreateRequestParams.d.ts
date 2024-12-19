import { MarketingEventCreateRequestParams } from '../models/MarketingEventCreateRequestParams';
export declare class BatchInputMarketingEventCreateRequestParams {
    'inputs': Array<MarketingEventCreateRequestParams>;
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
