export declare class ActionFunction {
    'functionSource': string;
    'functionType': ActionFunctionFunctionTypeEnum;
    'id'?: string;
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
export type ActionFunctionFunctionTypeEnum = "PRE_ACTION_EXECUTION" | "PRE_FETCH_OPTIONS" | "POST_FETCH_OPTIONS";
