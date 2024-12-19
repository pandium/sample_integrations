export declare class PublicActionLabels {
    'inputFieldDescriptions'?: {
        [key: string]: string;
    };
    'appDisplayName'?: string;
    'outputFieldLabels'?: {
        [key: string]: string;
    };
    'inputFieldOptionLabels'?: {
        [key: string]: {
            [key: string]: string;
        };
    };
    'actionDescription'?: string;
    'executionRules'?: {
        [key: string]: string;
    };
    'inputFieldLabels'?: {
        [key: string]: string;
    };
    'actionName': string;
    'actionCardContent'?: string;
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
