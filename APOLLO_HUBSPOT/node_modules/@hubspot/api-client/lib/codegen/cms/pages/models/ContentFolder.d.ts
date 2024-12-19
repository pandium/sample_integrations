export declare class ContentFolder {
    'deletedAt': Date;
    'parentFolderId': number;
    'created': Date;
    'name': string;
    'id': string;
    'category': number;
    'updated': Date;
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
