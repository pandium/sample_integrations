export declare class ContentLanguageVariation {
    'id': number;
    'name': string;
    'slug': string;
    'state': string;
    'authorName': string;
    'password': string;
    'publicAccessRulesEnabled': boolean;
    'publicAccessRules': Array<any>;
    'campaign': string;
    'tagIds'?: Array<number>;
    'archivedInDashboard': boolean;
    'created': Date;
    'updated': Date;
    'publishDate': Date;
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
