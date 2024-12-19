import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext, HttpFile } from '../http/http';
export declare class ValidationApiRequestFactory extends BaseAPIRequestFactory {
    doValidate(path: string, file?: HttpFile, _options?: Configuration): Promise<RequestContext>;
}
export declare class ValidationApiResponseProcessor {
    doValidate(response: ResponseContext): Promise<void>;
}
