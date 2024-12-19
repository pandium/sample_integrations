export declare class ContentLanguageVariation {
    'archivedInDashboard': boolean;
    'created': Date;
    'tagIds'?: Array<number>;
    'publishDate': Date;
    'publicAccessRules': Array<any>;
    'password': string;
    'authorName': string;
    'publicAccessRulesEnabled': boolean;
    'name': string;
    'campaign': string;
    'id': number;
    'state': string;
    'updated': Date;
    'slug': string;
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
