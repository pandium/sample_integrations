import { HubDbTableRowV3BatchUpdateRequest } from '../models/HubDbTableRowV3BatchUpdateRequest';
export declare class BatchInputHubDbTableRowV3BatchUpdateRequest {
    'inputs': Array<HubDbTableRowV3BatchUpdateRequest>;
    static readonly discriminator: string | undefined;
    static readonly attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
        format: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
        format: string;
    }[];
    constructor();
}
