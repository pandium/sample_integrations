import { SubscriptionDefinition } from '../models/SubscriptionDefinition';
export declare class SubscriptionDefinitionsResponse {
    'subscriptionDefinitions': Array<SubscriptionDefinition>;
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
