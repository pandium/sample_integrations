import { AccountingExtensionTerm } from '../models/AccountingExtensionTerm';
export declare class TermsResponse {
    'result'?: TermsResponseResultEnum;
    'terms': Array<AccountingExtensionTerm>;
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
export type TermsResponseResultEnum = "OK" | "ERR";
