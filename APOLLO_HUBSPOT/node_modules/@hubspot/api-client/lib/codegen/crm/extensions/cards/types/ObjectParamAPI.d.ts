import { Configuration } from '../configuration';
import { CardCreateRequest } from '../models/CardCreateRequest';
import { CardListResponse } from '../models/CardListResponse';
import { CardPatchRequest } from '../models/CardPatchRequest';
import { CardResponse } from '../models/CardResponse';
import { IntegratorCardPayloadResponse } from '../models/IntegratorCardPayloadResponse';
import { CardsApiRequestFactory, CardsApiResponseProcessor } from "../apis/CardsApi";
export interface CardsApiArchiveRequest {
    appId: number;
    cardId: string;
}
export interface CardsApiCreateRequest {
    appId: number;
    cardCreateRequest: CardCreateRequest;
}
export interface CardsApiGetAllRequest {
    appId: number;
}
export interface CardsApiGetByIdRequest {
    appId: number;
    cardId: string;
}
export interface CardsApiUpdateRequest {
    appId: number;
    cardId: string;
    cardPatchRequest: CardPatchRequest;
}
export declare class ObjectCardsApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: CardsApiRequestFactory, responseProcessor?: CardsApiResponseProcessor);
    archive(param: CardsApiArchiveRequest, options?: Configuration): Promise<void>;
    create(param: CardsApiCreateRequest, options?: Configuration): Promise<CardResponse>;
    getAll(param: CardsApiGetAllRequest, options?: Configuration): Promise<CardListResponse>;
    getById(param: CardsApiGetByIdRequest, options?: Configuration): Promise<CardResponse>;
    update(param: CardsApiUpdateRequest, options?: Configuration): Promise<CardResponse>;
}
import { SampleResponseApiRequestFactory, SampleResponseApiResponseProcessor } from "../apis/SampleResponseApi";
export interface SampleResponseApiGetCardsSampleResponseRequest {
}
export declare class ObjectSampleResponseApi {
    private api;
    constructor(configuration: Configuration, requestFactory?: SampleResponseApiRequestFactory, responseProcessor?: SampleResponseApiResponseProcessor);
    getCardsSampleResponse(param?: SampleResponseApiGetCardsSampleResponseRequest, options?: Configuration): Promise<IntegratorCardPayloadResponse>;
}
