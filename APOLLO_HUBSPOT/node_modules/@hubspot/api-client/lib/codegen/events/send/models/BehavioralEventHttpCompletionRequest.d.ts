export declare class BehavioralEventHttpCompletionRequest {
    'occurredAt'?: Date;
    'eventName': string;
    'utk'?: string;
    'uuid'?: string;
    'email'?: string;
    'properties'?: {
        [key: string]: string;
    };
    'objectId'?: string;
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
