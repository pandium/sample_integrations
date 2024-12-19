export declare class MarketingEventEmailSubscriber {
    'contactProperties'?: {
        [key: string]: string;
    };
    'properties'?: {
        [key: string]: string;
    };
    'email': string;
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
