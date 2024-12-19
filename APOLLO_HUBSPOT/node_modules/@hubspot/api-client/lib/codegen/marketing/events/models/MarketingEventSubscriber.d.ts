export declare class MarketingEventSubscriber {
    'vid'?: number;
    'properties'?: {
        [key: string]: string;
    };
    'interactionDateTime': number;
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
