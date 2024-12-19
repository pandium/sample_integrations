import { Configuration } from '../configuration';
import { Observable } from '../rxjsStub';
import { CardCreateRequest } from '../models/CardCreateRequest';
import { CardListResponse } from '../models/CardListResponse';
import { CardPatchRequest } from '../models/CardPatchRequest';
import { CardResponse } from '../models/CardResponse';
import { IntegratorCardPayloadResponse } from '../models/IntegratorCardPayloadResponse';
import { CardsApiRequestFactory, CardsApiResponseProcessor } from "../apis/CardsApi";
export declare class ObservableCardsApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: CardsApiRequestFactory, responseProcessor?: CardsApiResponseProcessor);
    archive(appId: number, cardId: string, _options?: Configuration): Observable<void>;
    create(appId: number, cardCreateRequest: CardCreateRequest, _options?: Configuration): Observable<CardResponse>;
    getAll(appId: number, _options?: Configuration): Observable<CardListResponse>;
    getById(appId: number, cardId: string, _options?: Configuration): Observable<CardResponse>;
    update(appId: number, cardId: string, cardPatchRequest: CardPatchRequest, _options?: Configuration): Observable<CardResponse>;
}
import { SampleResponseApiRequestFactory, SampleResponseApiResponseProcessor } from "../apis/SampleResponseApi";
export declare class ObservableSampleResponseApi {
    private requestFactory;
    private responseProcessor;
    private configuration;
    constructor(configuration: Configuration, requestFactory?: SampleResponseApiRequestFactory, responseProcessor?: SampleResponseApiResponseProcessor);
    getCardsSampleResponse(_options?: Configuration): Observable<IntegratorCardPayloadResponse>;
}
