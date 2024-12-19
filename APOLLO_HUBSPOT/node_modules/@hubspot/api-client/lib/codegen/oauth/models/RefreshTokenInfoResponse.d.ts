export declare class RefreshTokenInfoResponse {
    'token': string;
    'user'?: string;
    'hubDomain'?: string;
    'scopes': Array<string>;
    'hubId': number;
    'clientId': string;
    'userId': number;
    'tokenType': string;
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
