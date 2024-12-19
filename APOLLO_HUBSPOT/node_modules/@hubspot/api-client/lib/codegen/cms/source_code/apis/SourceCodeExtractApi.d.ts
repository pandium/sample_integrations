import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { ActionResponse } from '../models/ActionResponse';
import { FileExtractRequest } from '../models/FileExtractRequest';
import { TaskLocator } from '../models/TaskLocator';
export declare class SourceCodeExtractApiRequestFactory extends BaseAPIRequestFactory {
    doAsync(fileExtractRequest: FileExtractRequest, _options?: Configuration): Promise<RequestContext>;
    getAsyncStatus(taskId: number, _options?: Configuration): Promise<RequestContext>;
}
export declare class SourceCodeExtractApiResponseProcessor {
    doAsync(response: ResponseContext): Promise<TaskLocator>;
    getAsyncStatus(response: ResponseContext): Promise<ActionResponse>;
}
