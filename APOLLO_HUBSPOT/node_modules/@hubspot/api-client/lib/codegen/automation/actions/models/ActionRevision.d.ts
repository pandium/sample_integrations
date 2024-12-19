import { ExtensionActionDefinition } from '../models/ExtensionActionDefinition';
export declare class ActionRevision {
    'definition': ExtensionActionDefinition;
    'createdAt': Date;
    'id': string;
    'revisionId': string;
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
