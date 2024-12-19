export declare class TimelineEventIFrame {
    'linkLabel': string;
    'headerLabel': string;
    'url': string;
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
