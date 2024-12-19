import { Configuration } from '../configuration';
import { CardCreateRequest } from '../models/CardCreateRequest';
import { CardListResponse } from '../models/CardListResponse';
import { CardPatchRequest } from '../models/CardPatchRequest';
import { CardResponse } from '../models/CardResponse';
import { IntegratorCardPayloadResponse } from '../models/IntegratorCardPayloadResponse';
import { CardsApiRequestFactory, CardsApiResponseProcessor } from "../apis/CardsApi";
export declare class PromiseCardsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CardsApiRequestFactory, responseProcessor?: CardsApiResponseProcessor);
    archive(appId: number, cardId: string, _options?: Configuration): Promise<void>;
    create(appId: number, cardCreateRequest: CardCreateRequest, _options?: Configuration): Promise<CardResponse>;
    getAll(appId: number, _options?: Configuration): Promise<CardListResponse>;
    getById(appId: number, cardId: string, _options?: Configuration): Promise<CardResponse>;
    update(appId: number, cardId: string, cardPatchRequest: CardPatchRequest, _options?: Configuration): Promise<CardResponse>;
}
import { SampleResponseApiRequestFactory, SampleResponseApiResponseProcessor } from "../apis/SampleResponseApi";
export declare class PromiseSampleResponseApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SampleResponseApiRequestFactory, responseProcessor?: SampleResponseApiResponseProcessor);
    getCardsSampleResponse(_options?: Configuration): Promise<IntegratorCardPayloadResponse>;
}
