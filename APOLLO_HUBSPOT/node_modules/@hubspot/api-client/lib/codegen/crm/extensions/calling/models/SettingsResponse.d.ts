export declare class SettingsResponse {
    'name': string;
    'url': string;
    'height': number;
    'width': number;
    'isReady': boolean;
    'supportsCustomObjects': boolean;
    'createdAt': Date;
    'updatedAt': Date;
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
