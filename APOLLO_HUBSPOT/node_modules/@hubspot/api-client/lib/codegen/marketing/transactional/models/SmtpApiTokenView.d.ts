export declare class SmtpApiTokenView {
    'id': string;
    'createdBy': string;
    'password'?: string;
    'emailCampaignId': string;
    'createdAt': Date;
    'createContact': boolean;
    'campaignName': string;
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
