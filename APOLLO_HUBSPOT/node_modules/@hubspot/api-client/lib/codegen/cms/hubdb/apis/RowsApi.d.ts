import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseWithTotalHubDbTableRowV3ForwardPaging } from '../models/CollectionResponseWithTotalHubDbTableRowV3ForwardPaging';
import { HubDbTableRowV3 } from '../models/HubDbTableRowV3';
import { HubDbTableRowV3Request } from '../models/HubDbTableRowV3Request';
export declare class RowsApiRequestFactory extends BaseAPIRequestFactory {
    cloneDraftTableRow(tableIdOrName: string, rowId: string, _options?: Configuration): Promise<RequestContext>;
    createTableRow(tableIdOrName: string, hubDbTableRowV3Request: HubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
    getDraftTableRowById(tableIdOrName: string, rowId: string, _options?: Configuration): Promise<RequestContext>;
    getTableRow(tableIdOrName: string, rowId: string, _options?: Configuration): Promise<RequestContext>;
    getTableRows(tableIdOrName: string, sort?: Array<string>, after?: string, limit?: number, properties?: Array<string>, _options?: Configuration): Promise<RequestContext>;
    purgeDraftTableRow(tableIdOrName: string, rowId: string, _options?: Configuration): Promise<RequestContext>;
    readDraftTableRows(tableIdOrName: string, sort?: Array<string>, after?: string, limit?: number, properties?: Array<string>, _options?: Configuration): Promise<RequestContext>;
    replaceDraftTableRow(tableIdOrName: string, rowId: string, hubDbTableRowV3Request: HubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
    updateDraftTableRow(tableIdOrName: string, rowId: string, hubDbTableRowV3Request: HubDbTableRowV3Request, _options?: Configuration): Promise<RequestContext>;
}
export declare class RowsApiResponseProcessor {
    cloneDraftTableRow(response: ResponseContext): Promise<HubDbTableRowV3>;
    createTableRow(response: ResponseContext): Promise<HubDbTableRowV3>;
    getDraftTableRowById(response: ResponseContext): Promise<HubDbTableRowV3>;
    getTableRow(response: ResponseContext): Promise<HubDbTableRowV3>;
    getTableRows(response: ResponseContext): Promise<CollectionResponseWithTotalHubDbTableRowV3ForwardPaging>;
    purgeDraftTableRow(response: ResponseContext): Promise<void>;
    readDraftTableRows(response: ResponseContext): Promise<CollectionResponseWithTotalHubDbTableRowV3ForwardPaging>;
    replaceDraftTableRow(response: ResponseContext): Promise<HubDbTableRowV3>;
    updateDraftTableRow(response: ResponseContext): Promise<HubDbTableRowV3>;
}
