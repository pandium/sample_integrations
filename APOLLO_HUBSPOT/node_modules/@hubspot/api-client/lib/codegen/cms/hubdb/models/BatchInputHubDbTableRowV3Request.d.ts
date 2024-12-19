import { HubDbTableRowV3Request } from '../models/HubDbTableRowV3Request';
export declare class BatchInputHubDbTableRowV3Request {
    'inputs': Array<HubDbTableRowV3Request>;
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
