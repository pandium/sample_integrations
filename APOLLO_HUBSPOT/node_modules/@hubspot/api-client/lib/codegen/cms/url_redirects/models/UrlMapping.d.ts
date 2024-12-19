export declare class UrlMapping {
    'id': string;
    'routePrefix': string;
    'destination': string;
    'redirectStyle': number;
    'isOnlyAfterNotFound': boolean;
    'isMatchFullUrl': boolean;
    'isMatchQueryString': boolean;
    'isPattern': boolean;
    'isTrailingSlashOptional': boolean;
    'isProtocolAgnostic': boolean;
    'precedence': number;
    'created'?: Date;
    'updated'?: Date;
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
