export declare class PublicAuditInfo {
    'portalId': number;
    'identifier': string;
    'action': string;
    'timestamp'?: Date;
    'message'?: string;
    'rawObject'?: any;
    'fromUserId'?: number;
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
