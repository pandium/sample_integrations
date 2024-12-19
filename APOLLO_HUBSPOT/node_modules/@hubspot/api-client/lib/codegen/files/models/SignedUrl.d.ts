export declare class SignedUrl {
    'expiresAt': Date;
    'url': string;
    'name': string;
    'extension': string;
    'type': string;
    'size': number;
    'height'?: number;
    'width'?: number;
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
