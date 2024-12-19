export declare class PublicSingleFieldDependency {
    'dependencyType': PublicSingleFieldDependencyDependencyTypeEnum;
    'dependentFieldNames': Array<string>;
    'controllingFieldName': string;
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
export declare enum PublicSingleFieldDependencyDependencyTypeEnum {
    SingleField = "SINGLE_FIELD"
}
