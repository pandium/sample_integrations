export declare class AssociationSpec {
    'associationCategory': AssociationSpecAssociationCategoryEnum;
    'associationTypeId': number;
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
export type AssociationSpecAssociationCategoryEnum = "HUBSPOT_DEFINED" | "USER_DEFINED" | "INTEGRATOR_DEFINED";
