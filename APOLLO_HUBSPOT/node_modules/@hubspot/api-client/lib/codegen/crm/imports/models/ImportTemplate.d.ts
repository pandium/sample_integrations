export declare class ImportTemplate {
    'templateType': ImportTemplateTemplateTypeEnum;
    'templateId': number;
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
export declare enum ImportTemplateTemplateTypeEnum {
    AdminDefined = "admin_defined",
    PreviousImport = "previous_import",
    UserFile = "user_file"
}
