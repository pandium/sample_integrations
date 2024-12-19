import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CreateUserAccountRequestExternal } from '../models/CreateUserAccountRequestExternal';
export declare class UserAccountsApiRequestFactory extends BaseAPIRequestFactory {
    archive(accountId: string, _options?: Configuration): Promise<RequestContext>;
    replace(createUserAccountRequestExternal: CreateUserAccountRequestExternal, _options?: Configuration): Promise<RequestContext>;
}
export declare class UserAccountsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    replace(response: ResponseContext): Promise<void>;
}
