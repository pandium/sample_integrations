import { InputFieldDefinition } from '../models/InputFieldDefinition';
import { OutputFieldDefinition } from '../models/OutputFieldDefinition';
import { PublicActionDefinitionInputFieldDependenciesInner } from '../models/PublicActionDefinitionInputFieldDependenciesInner';
import { PublicActionLabels } from '../models/PublicActionLabels';
import { PublicExecutionTranslationRule } from '../models/PublicExecutionTranslationRule';
import { PublicObjectRequestOptions } from '../models/PublicObjectRequestOptions';
export declare class PublicActionDefinitionPatch {
    'inputFields'?: Array<InputFieldDefinition>;
    'outputFields'?: Array<OutputFieldDefinition>;
    'actionUrl'?: string;
    'inputFieldDependencies'?: Array<PublicActionDefinitionInputFieldDependenciesInner>;
    'published'?: boolean;
    'executionRules'?: Array<PublicExecutionTranslationRule>;
    'objectTypes'?: Array<string>;
    'objectRequestOptions'?: PublicObjectRequestOptions;
    'labels'?: {
        [key: string]: PublicActionLabels;
    };
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
