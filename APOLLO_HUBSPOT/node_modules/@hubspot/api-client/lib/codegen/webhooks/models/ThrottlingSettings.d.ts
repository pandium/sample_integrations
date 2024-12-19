export declare class ThrottlingSettings {
    'maxConcurrentRequests': number;
    'period': ThrottlingSettingsPeriodEnum;
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
export type ThrottlingSettingsPeriodEnum = "SECONDLY" | "ROLLING_MINUTE";
