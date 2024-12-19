export declare class PropertyModificationMetadata {
    'archivable': boolean;
    'readOnlyDefinition': boolean;
    'readOnlyOptions'?: boolean;
    'readOnlyValue': boolean;
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
