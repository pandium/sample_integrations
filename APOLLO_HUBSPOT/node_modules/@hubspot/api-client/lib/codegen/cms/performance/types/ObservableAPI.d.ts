import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { PublicPerformanceResponse } from '../models/PublicPerformanceResponse';
import { PublicPerformanceApiRequestFactory, PublicPerformanceApiResponseProcessor } from "../apis/PublicPerformanceApi";
export declare class ObservablePublicPerformanceApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: PublicPerformanceApiRequestFactory, responseProcessor?: PublicPerformanceApiResponseProcessor);
    getPage(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Observable<PublicPerformanceResponse>;
    getUptime(domain?: string, path?: string, pad?: boolean, sum?: boolean, period?: string, interval?: string, start?: number, end?: number, _options?: Configuration): Observable<PublicPerformanceResponse>;
}
