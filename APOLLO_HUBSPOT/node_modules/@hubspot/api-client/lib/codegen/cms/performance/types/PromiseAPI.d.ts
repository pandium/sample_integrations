import { Configuration } from '../configuration';
import { PublicPerformanceResponse } from '../models/PublicPerformanceResponse';
import { PublicPerformanceApiRequestFactory, PublicPerformanceApiResponseProcessor } from "../apis/PublicPerformanceApi";
export declare class PromisePublicPerformanceApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicPerformanceApiRequestFactory, responseProcessor?: PublicPerformanceApiResponseProcessor);
    getPage(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Promise<PublicPerformanceResponse>;
    getUptime(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Promise<PublicPerformanceResponse>;
}
