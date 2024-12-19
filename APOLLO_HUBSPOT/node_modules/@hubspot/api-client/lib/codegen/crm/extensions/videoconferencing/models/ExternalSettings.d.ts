export declare class ExternalSettings {
    'createMeetingUrl': string;
    'updateMeetingUrl'?: string;
    'deleteMeetingUrl'?: string;
    'userVerifyUrl'?: string;
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
