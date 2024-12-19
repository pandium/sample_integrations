export declare class ExternalUnifiedEvent {
    'objectType': string;
    'objectId': string;
    'eventType': string;
    'occurredAt': Date;
    'id': string;
    'properties': {
        [key: string]: string;
    };
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
