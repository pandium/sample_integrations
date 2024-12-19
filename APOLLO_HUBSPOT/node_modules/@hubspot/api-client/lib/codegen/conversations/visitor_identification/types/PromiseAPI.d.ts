import { Configuration } from '../configuration';
import { IdentificationTokenGenerationRequest } from '../models/IdentificationTokenGenerationRequest';
import { IdentificationTokenResponse } from '../models/IdentificationTokenResponse';
import { GenerateApiRequestFactory, GenerateApiResponseProcessor } from "../apis/GenerateApi";
export declare class PromiseGenerateApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: GenerateApiRequestFactory, responseProcessor?: GenerateApiResponseProcessor);
    generateToken(identificationTokenGenerationRequest: IdentificationTokenGenerationRequest, _options?: Configuration): Promise<IdentificationTokenResponse>;
}
