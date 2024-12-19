export declare class SettingsPatchRequest {
    'name'?: string;
    'url'?: string;
    'height'?: number;
    'width'?: number;
    'isReady'?: boolean;
    'supportsCustomObjects'?: boolean;
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
