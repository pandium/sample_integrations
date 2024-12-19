import { ActionConfirmationBody } from '../models/ActionConfirmationBody';
export declare class IntegratorObjectResultActionsInner {
    'type': IntegratorObjectResultActionsInnerTypeEnum;
    'confirmation'?: ActionConfirmationBody;
    'httpMethod': IntegratorObjectResultActionsInnerHttpMethodEnum;
    'url': string;
    'label'?: string;
    'propertyNamesIncluded': Array<string>;
    'width': number;
    'height': number;
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
export type IntegratorObjectResultActionsInnerTypeEnum = "IFRAME";
export type IntegratorObjectResultActionsInnerHttpMethodEnum = "CONNECT" | "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "TRACE";
