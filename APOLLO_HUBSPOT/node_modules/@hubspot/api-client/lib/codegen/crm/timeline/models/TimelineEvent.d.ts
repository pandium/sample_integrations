import { TimelineEventIFrame } from '../models/TimelineEventIFrame';
export declare class TimelineEvent {
    'eventTemplateId': string;
    'email'?: string;
    'objectId'?: string;
    'utk'?: string;
    'domain'?: string;
    'timestamp'?: Date;
    'tokens': {
        [key: string]: string;
    };
    'extraData'?: any;
    'timelineIFrame'?: TimelineEventIFrame;
    'id'?: string;
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
