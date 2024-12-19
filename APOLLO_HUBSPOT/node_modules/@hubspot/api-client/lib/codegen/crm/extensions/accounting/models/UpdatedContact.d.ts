export declare class UpdatedContact {
    'syncAction': UpdatedContactSyncActionEnum;
    'updatedAt': Date;
    'emailAddress': string;
    'id': string;
    'customerType'?: UpdatedContactCustomerTypeEnum;
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
export type UpdatedContactSyncActionEnum = "CREATE" | "UPDATE" | "DELETE";
export type UpdatedContactCustomerTypeEnum = "CONTACT" | "COMPANY";
