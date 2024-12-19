export declare class UpdatedProduct {
    'syncAction': UpdatedProductSyncActionEnum;
    'updatedAt': Date;
    'price': number;
    'currencyCode'?: string;
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
export type UpdatedProductSyncActionEnum = "CREATE" | "UPDATE" | "DELETE";
