export declare class AccessTokenInfoResponse {
    'token': string;
    'user'?: string;
    'hubDomain'?: string;
    'scopes': Array<string>;
    'scopeToScopeGroupPks': Array<number>;
    'trialScopes': Array<string>;
    'trialScopeToScopeGroupPks': Array<number>;
    'hubId': number;
    'appId': number;
    'expiresIn': number;
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
