export declare class Address {
    'country'?: string;
    'countrySubDivisionCode'?: string;
    'city'?: string;
    'postalCode'?: string;
    'lineOne'?: string;
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
