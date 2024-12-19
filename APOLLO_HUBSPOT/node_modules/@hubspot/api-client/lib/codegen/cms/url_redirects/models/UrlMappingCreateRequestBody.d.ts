export declare class UrlMappingCreateRequestBody {
    'precedence'?: number;
    'isOnlyAfterNotFound'?: boolean;
    'isMatchFullUrl'?: boolean;
    'isMatchQueryString'?: boolean;
    'isPattern'?: boolean;
    'isTrailingSlashOptional'?: boolean;
    'isProtocolAgnostic'?: boolean;
    'routePrefix': string;
    'destination': string;
    'redirectStyle': number;
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
