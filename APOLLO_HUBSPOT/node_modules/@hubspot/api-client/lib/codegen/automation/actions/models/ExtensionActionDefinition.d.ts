import { ActionFunctionIdentifier } from '../models/ActionFunctionIdentifier';
import { ActionLabels } from '../models/ActionLabels';
import { ExtensionActionDefinitionPatchInputFieldDependenciesInner } from '../models/ExtensionActionDefinitionPatchInputFieldDependenciesInner';
import { InputFieldDefinition } from '../models/InputFieldDefinition';
import { ObjectRequestOptions } from '../models/ObjectRequestOptions';
export declare class ExtensionActionDefinition {
    'id': string;
    'revisionId': string;
    'functions': Array<ActionFunctionIdentifier>;
    'actionUrl': string;
    'published': boolean;
    'archivedAt'?: number;
    'inputFields': Array<InputFieldDefinition>;
    'objectRequestOptions'?: ObjectRequestOptions;
    'inputFieldDependencies'?: Array<ExtensionActionDefinitionPatchInputFieldDependenciesInner>;
    'labels': {
        [key: string]: ActionLabels;
    };
    'objectTypes': Array<string>;
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
