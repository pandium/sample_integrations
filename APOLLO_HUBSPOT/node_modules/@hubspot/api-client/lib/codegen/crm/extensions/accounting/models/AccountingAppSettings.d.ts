import { AccountingAppUrls } from '../models/AccountingAppUrls';
import { AccountingFeatures } from '../models/AccountingFeatures';
export declare class AccountingAppSettings {
    'appId': number;
    'urls': AccountingAppUrls;
    'features'?: AccountingFeatures;
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
