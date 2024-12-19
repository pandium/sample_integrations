export declare class AssociationSpecWithLabel {
    'category': AssociationSpecWithLabelCategoryEnum;
    'typeId': number;
    'label'?: string;
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
export type AssociationSpecWithLabelCategoryEnum = "HUBSPOT_DEFINED" | "USER_DEFINED" | "INTEGRATOR_DEFINED";
