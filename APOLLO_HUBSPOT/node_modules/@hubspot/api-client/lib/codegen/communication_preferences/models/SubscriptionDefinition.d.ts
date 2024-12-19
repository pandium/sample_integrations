export declare class SubscriptionDefinition {
    'id': string;
    'name': string;
    'description': string;
    'purpose'?: string;
    'communicationMethod'?: string;
    'isActive': boolean;
    'isDefault': boolean;
    'isInternal': boolean;
    'createdAt': Date;
    'updatedAt': Date;
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
