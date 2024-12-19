import { Configuration } from '../configuration';
import { PublicPerformanceResponse } from '../models/PublicPerformanceResponse';
import { PublicPerformanceApiRequestFactory, PublicPerformanceApiResponseProcessor } from "../apis/PublicPerformanceApi";
export interface PublicPerformanceApiGetPageRequest {
    domain?: string;
    path?: string;
    pad?: boolean;
    sum?: boolean;
    period?: string;
    interval?: string;
    start?: number;
    end?: number;
}
export interface PublicPerformanceApiGetUptimeRequest {
    domain?: string;
    path?: string;
    pad?: boolean;
    sum?: boolean;
    period?: string;
    interval?: string;
    start?: number;
    end?: number;
}
export declare class ObjectPublicPerformanceApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: PublicPerformanceApiRequestFactory, responseProcessor?: PublicPerformanceApiResponseProcessor);
    getPage(param?: PublicPerformanceApiGetPageRequest, options?: Configuration): Promise<PublicPerformanceResponse>;
    getUptime(param?: PublicPerformanceApiGetUptimeRequest, options?: Configuration): Promise<PublicPerformanceResponse>;
}
