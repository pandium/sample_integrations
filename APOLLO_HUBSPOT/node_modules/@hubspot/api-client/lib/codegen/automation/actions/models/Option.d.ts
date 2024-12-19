export declare class Option {
    'label': string;
    'value': string;
    'displayOrder': number;
    'doubleData': number;
    'hidden': boolean;
    'description': string;
    'readOnly': boolean;
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
