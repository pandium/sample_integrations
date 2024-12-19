export declare class PublicSubscriptionStatus {
    'id': string;
    'name': string;
    'description': string;
    'status': PublicSubscriptionStatusStatusEnum;
    'sourceOfStatus': PublicSubscriptionStatusSourceOfStatusEnum;
    'brandId'?: number;
    'preferenceGroupName'?: string;
    'legalBasis'?: PublicSubscriptionStatusLegalBasisEnum;
    'legalBasisExplanation'?: string;
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
export type PublicSubscriptionStatusStatusEnum = "SUBSCRIBED" | "NOT_SUBSCRIBED";
export type PublicSubscriptionStatusSourceOfStatusEnum = "PORTAL_WIDE_STATUS" | "BRAND_WIDE_STATUS" | "SUBSCRIPTION_STATUS";
export type PublicSubscriptionStatusLegalBasisEnum = "LEGITIMATE_INTEREST_PQL" | "LEGITIMATE_INTEREST_CLIENT" | "PERFORMANCE_OF_CONTRACT" | "CONSENT_WITH_NOTICE" | "NON_GDPR" | "PROCESS_AND_STORE" | "LEGITIMATE_INTEREST_OTHER";
