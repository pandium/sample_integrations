export declare class Domain {
    'id': string;
    'domain': string;
    'primaryLandingPage'?: boolean;
    'primaryEmail'?: boolean;
    'primaryBlogPost'?: boolean;
    'primarySitePage'?: boolean;
    'primaryKnowledge'?: boolean;
    'secondaryToDomain'?: string;
    'isResolving': boolean;
    'manuallyMarkedAsResolving'?: boolean;
    'isSslEnabled'?: boolean;
    'isSslOnly'?: boolean;
    'isUsedForBlogPost': boolean;
    'isUsedForSitePage': boolean;
    'isUsedForLandingPage': boolean;
    'isUsedForEmail': boolean;
    'isUsedForKnowledge': boolean;
    'correctCname'?: string;
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
