export declare class CardAuditResponse {
    'actionType': CardAuditResponseActionTypeEnum;
    'objectTypeId': number;
    'authSource': CardAuditResponseAuthSourceEnum;
    'changedAt': number;
    'applicationId': number;
    'initiatingUserId': number;
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
export declare enum CardAuditResponseActionTypeEnum {
    Create = "CREATE",
    Update = "UPDATE",
    Delete = "DELETE"
}
export declare enum CardAuditResponseAuthSourceEnum {
    Internal = "INTERNAL",
    App = "APP",
    External = "EXTERNAL"
}
