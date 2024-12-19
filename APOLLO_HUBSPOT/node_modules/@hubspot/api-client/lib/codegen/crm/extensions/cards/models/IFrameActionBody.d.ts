export declare class IFrameActionBody {
    'type': IFrameActionBodyTypeEnum;
    'width': number;
    'height': number;
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
export type IFrameActionBodyTypeEnum = "IFRAME";
