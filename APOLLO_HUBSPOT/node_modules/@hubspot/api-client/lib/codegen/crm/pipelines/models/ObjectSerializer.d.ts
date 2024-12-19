export * from '../models/CollectionResponsePipelineNoPaging';
export * from '../models/CollectionResponsePipelineStageNoPaging';
export * from '../models/CollectionResponsePublicAuditInfoNoPaging';
export * from '../models/ErrorDetail';
export * from '../models/ModelError';
export * from '../models/Pipeline';
export * from '../models/PipelineInput';
export * from '../models/PipelinePatchInput';
export * from '../models/PipelineStage';
export * from '../models/PipelineStageInput';
export * from '../models/PipelineStagePatchInput';
export * from '../models/PublicAuditInfo';
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string, format: string): any;
    static deserialize(data: any, type: string, format: string): any;
    static normalizeMediaType(mediaType: string | undefined): string | undefined;
    static getPreferredMediaType(mediaTypes: Array<string>): string;
    static stringify(data: any, mediaType: string): string;
    static parse(rawData: string, mediaType: string | undefined): any;
}
