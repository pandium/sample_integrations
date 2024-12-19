export declare class ActionLabels {
    'inputFieldLabels'?: {
        [key: string]: string;
    };
    'inputFieldDescriptions'?: {
        [key: string]: string;
    };
    'actionName': string;
    'actionDescription'?: string;
    'appDisplayName'?: string;
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
