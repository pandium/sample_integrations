export declare class DisplayOption {
    'name': string;
    'label': string;
    'type': DisplayOptionTypeEnum;
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
export type DisplayOptionTypeEnum = "DEFAULT" | "SUCCESS" | "WARNING" | "DANGER" | "INFO";
