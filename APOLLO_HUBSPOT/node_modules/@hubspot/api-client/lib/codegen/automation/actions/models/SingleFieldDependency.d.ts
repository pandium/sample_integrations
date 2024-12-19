export declare class SingleFieldDependency {
    'dependencyType': SingleFieldDependencyDependencyTypeEnum;
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
export type SingleFieldDependencyDependencyTypeEnum = "SINGLE_FIELD";
