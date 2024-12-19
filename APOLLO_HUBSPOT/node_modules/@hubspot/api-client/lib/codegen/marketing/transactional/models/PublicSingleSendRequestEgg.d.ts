import { PublicSingleSendEmail } from '../models/PublicSingleSendEmail';
export declare class PublicSingleSendRequestEgg {
    'emailId': number;
    'message': PublicSingleSendEmail;
    'contactProperties'?: {
        [key: string]: string;
    };
    'customProperties'?: {
        [key: string]: any;
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
