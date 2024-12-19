import { InputFieldDefinition } from '../models/InputFieldDefinition';
import { OutputFieldDefinition } from '../models/OutputFieldDefinition';
import { PublicActionDefinitionInputFieldDependenciesInner } from '../models/PublicActionDefinitionInputFieldDependenciesInner';
import { PublicActionFunctionIdentifier } from '../models/PublicActionFunctionIdentifier';
import { PublicActionLabels } from '../models/PublicActionLabels';
import { PublicExecutionTranslationRule } from '../models/PublicExecutionTranslationRule';
import { PublicObjectRequestOptions } from '../models/PublicObjectRequestOptions';
export declare class PublicActionDefinition {
    'functions': Array<PublicActionFunctionIdentifier>;
    'actionUrl': string;
    'published': boolean;
    'labels': {
        [key: string]: PublicActionLabels;
    };
    'inputFields': Array<InputFieldDefinition>;
    'outputFields'?: Array<OutputFieldDefinition>;
    'revisionId': string;
    'archivedAt'?: number;
    'inputFieldDependencies'?: Array<PublicActionDefinitionInputFieldDependenciesInner>;
    'executionRules'?: Array<PublicExecutionTranslationRule>;
    'id': string;
    'objectTypes': Array<string>;
    'objectRequestOptions'?: PublicObjectRequestOptions;
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
