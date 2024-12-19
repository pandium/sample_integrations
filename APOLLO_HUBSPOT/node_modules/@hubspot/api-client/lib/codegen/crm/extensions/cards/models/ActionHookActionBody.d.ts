import { ActionConfirmationBody } from '../models/ActionConfirmationBody';
export declare class ActionHookActionBody {
    'type': ActionHookActionBodyTypeEnum;
    'confirmation'?: ActionConfirmationBody;
    'httpMethod': ActionHookActionBodyHttpMethodEnum;
    'url': string;
    'label'?: string;
    'propertyNamesIncluded': Array<string>;
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
export type ActionHookActionBodyTypeEnum = "ACTION_HOOK";
export type ActionHookActionBodyHttpMethodEnum = "CONNECT" | "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "TRACE";
