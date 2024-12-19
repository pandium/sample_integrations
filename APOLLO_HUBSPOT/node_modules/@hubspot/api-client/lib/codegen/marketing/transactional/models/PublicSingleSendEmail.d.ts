export declare class PublicSingleSendEmail {
    '_from'?: string;
    'to': string;
    'sendId'?: string;
    'replyTo'?: Array<string>;
    'cc'?: Array<string>;
    'bcc'?: Array<string>;
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
