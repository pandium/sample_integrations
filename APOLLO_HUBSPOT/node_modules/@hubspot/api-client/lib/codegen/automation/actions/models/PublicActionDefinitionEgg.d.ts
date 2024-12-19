import { InputFieldDefinition } from '../models/InputFieldDefinition';
import { OutputFieldDefinition } from '../models/OutputFieldDefinition';
import { PublicActionDefinitionInputFieldDependenciesInner } from '../models/PublicActionDefinitionInputFieldDependenciesInner';
import { PublicActionFunction } from '../models/PublicActionFunction';
import { PublicActionLabels } from '../models/PublicActionLabels';
import { PublicExecutionTranslationRule } from '../models/PublicExecutionTranslationRule';
import { PublicObjectRequestOptions } from '../models/PublicObjectRequestOptions';
export declare class PublicActionDefinitionEgg {
    'inputFields': Array<InputFieldDefinition>;
    'outputFields'?: Array<OutputFieldDefinition>;
    'archivedAt'?: number;
    'functions': Array<PublicActionFunction>;
    'actionUrl': string;
    'inputFieldDependencies'?: Array<PublicActionDefinitionInputFieldDependenciesInner>;
    'published': boolean;
    'executionRules'?: Array<PublicExecutionTranslationRule>;
    'objectTypes': Array<string>;
    'objectRequestOptions'?: PublicObjectRequestOptions;
    'labels': {
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
