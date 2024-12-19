export declare class PublicUpdateSubscriptionStatusRequest {
    'emailAddress': string;
    'subscriptionId': string;
    'legalBasis'?: PublicUpdateSubscriptionStatusRequestLegalBasisEnum;
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
export type PublicUpdateSubscriptionStatusRequestLegalBasisEnum = "LEGITIMATE_INTEREST_PQL" | "LEGITIMATE_INTEREST_CLIENT" | "PERFORMANCE_OF_CONTRACT" | "CONSENT_WITH_NOTICE" | "NON_GDPR" | "PROCESS_AND_STORE" | "LEGITIMATE_INTEREST_OTHER";
