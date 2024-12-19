import { PublicSubscriptionStatus } from '../models/PublicSubscriptionStatus';
export declare class PublicSubscriptionStatusesResponse {
    'recipient': string;
    'subscriptionStatuses': Array<PublicSubscriptionStatus>;
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
