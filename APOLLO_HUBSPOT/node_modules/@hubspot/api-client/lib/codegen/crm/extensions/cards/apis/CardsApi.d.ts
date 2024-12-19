import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CardCreateRequest } from '../models/CardCreateRequest';
import { CardListResponse } from '../models/CardListResponse';
import { CardPatchRequest } from '../models/CardPatchRequest';
import { CardResponse } from '../models/CardResponse';
export declare class CardsApiRequestFactory extends BaseAPIRequestFactory {
    archive(appId: number, cardId: string, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, cardCreateRequest: CardCreateRequest, _options?: Configuration): Promise<RequestContext>;
    getAll(appId: number, _options?: Configuration): Promise<RequestContext>;
    getById(appId: number, cardId: string, _options?: Configuration): Promise<RequestContext>;
    update(appId: number, cardId: string, cardPatchRequest: CardPatchRequest, _options?: Configuration): Promise<RequestContext>;
}
export declare class CardsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<CardResponse>;
    getAll(response: ResponseContext): Promise<CardListResponse>;
    getById(response: ResponseContext): Promise<CardResponse>;
    update(response: ResponseContext): Promise<CardResponse>;
}
