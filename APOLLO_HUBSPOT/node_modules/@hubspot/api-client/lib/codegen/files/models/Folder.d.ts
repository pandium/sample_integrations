export declare class Folder {
    'id': string;
    'createdAt': Date;
    'archivedAt'?: Date;
    'updatedAt': Date;
    'archived': boolean;
    'parentFolderId'?: string;
    'name'?: string;
    'path'?: string;
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
