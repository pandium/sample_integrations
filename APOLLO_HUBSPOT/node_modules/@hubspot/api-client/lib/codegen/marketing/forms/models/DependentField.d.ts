import { DependentFieldDependentField } from '../models/DependentFieldDependentField';
import { DependentFieldFilter } from '../models/DependentFieldFilter';
export declare class DependentField {
    'dependentCondition': DependentFieldFilter;
    'dependentField': DependentFieldDependentField;
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
