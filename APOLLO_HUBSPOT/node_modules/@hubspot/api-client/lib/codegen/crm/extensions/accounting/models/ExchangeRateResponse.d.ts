export declare class ExchangeRateResponse {
    'result': ExchangeRateResponseResultEnum;
    'exchangeRate': number;
    'sourceCurrencyCode': string;
    'targetCurrencyCode': string;
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
export type ExchangeRateResponseResultEnum = "OK" | "ERR";
