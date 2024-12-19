export declare class ExtensionActionDefinitionPatchInputFieldDependenciesInner {
    'dependencyType': ExtensionActionDefinitionPatchInputFieldDependenciesInnerDependencyTypeEnum;
    'dependentFieldNames': Array<string>;
    'controllingFieldName': string;
    'controllingFieldValue': string;
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
export type ExtensionActionDefinitionPatchInputFieldDependenciesInnerDependencyTypeEnum = "CONDITIONAL_SINGLE_FIELD";
