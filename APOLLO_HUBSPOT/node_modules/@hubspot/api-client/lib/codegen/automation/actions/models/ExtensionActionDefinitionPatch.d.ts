import { ActionLabels } from '../models/ActionLabels';
import { ExtensionActionDefinitionPatchInputFieldDependenciesInner } from '../models/ExtensionActionDefinitionPatchInputFieldDependenciesInner';
import { InputFieldDefinition } from '../models/InputFieldDefinition';
import { ObjectRequestOptions } from '../models/ObjectRequestOptions';
export declare class ExtensionActionDefinitionPatch {
    'actionUrl'?: string;
    'published'?: boolean;
    'inputFields'?: Array<InputFieldDefinition>;
    'objectRequestOptions'?: ObjectRequestOptions;
    'inputFieldDependencies'?: Array<ExtensionActionDefinitionPatchInputFieldDependenciesInner>;
    'labels'?: {
        [key: string]: ActionLabels;
    };
    'objectTypes'?: Array<string>;
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
