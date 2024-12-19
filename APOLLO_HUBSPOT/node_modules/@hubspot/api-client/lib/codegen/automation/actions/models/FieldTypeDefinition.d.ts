import { Option } from '../models/Option';
export declare class FieldTypeDefinition {
    'name': string;
    'type': FieldTypeDefinitionTypeEnum;
    'fieldType'?: FieldTypeDefinitionFieldTypeEnum;
    'options': Array<Option>;
    'optionsUrl'?: string;
    'referencedObjectType'?: FieldTypeDefinitionReferencedObjectTypeEnum;
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
export type FieldTypeDefinitionTypeEnum = "string" | "number" | "bool" | "datetime" | "enumeration" | "date" | "phone_number" | "currency_number" | "json" | "object_coordinates";
export type FieldTypeDefinitionFieldTypeEnum = "booleancheckbox" | "checkbox" | "date" | "file" | "number" | "phonenumber" | "radio" | "select" | "text" | "textarea" | "calculation_equation" | "calculation_rollup" | "calculation_score" | "calculation_read_time" | "unknown";
export type FieldTypeDefinitionReferencedObjectTypeEnum = "CONTACT" | "COMPANY" | "DEAL" | "ENGAGEMENT" | "TICKET" | "OWNER" | "PRODUCT" | "LINE_ITEM" | "BET_DELIVERABLE_SERVICE" | "CONTENT" | "CONVERSATION" | "BET_ALERT" | "PORTAL" | "QUOTE" | "FORM_SUBMISSION_INBOUNDDB" | "QUOTA" | "UNSUBSCRIBE" | "COMMUNICATION" | "FEEDBACK_SUBMISSION" | "ATTRIBUTION" | "SALESFORCE_SYNC_ERROR" | "RESTORABLE_CRM_OBJECT" | "HUB" | "LANDING_PAGE" | "PRODUCT_OR_FOLDER" | "TASK" | "FORM" | "MARKETING_EMAIL" | "AD_ACCOUNT" | "AD_CAMPAIGN" | "AD_GROUP" | "AD" | "KEYWORD" | "CAMPAIGN" | "SOCIAL_CHANNEL" | "SOCIAL_POST" | "SITE_PAGE" | "BLOG_POST" | "IMPORT" | "EXPORT" | "CTA" | "TASK_TEMPLATE" | "AUTOMATION_PLATFORM_FLOW" | "OBJECT_LIST" | "NOTE" | "MEETING_EVENT" | "CALL" | "EMAIL" | "PUBLISHING_TASK" | "CONVERSATION_SESSION" | "CONTACT_CREATE_ATTRIBUTION" | "INVOICE" | "MARKETING_EVENT" | "CONVERSATION_INBOX" | "CHATFLOW" | "MEDIA_BRIDGE" | "SEQUENCE" | "SEQUENCE_STEP" | "FORECAST" | "SNIPPET" | "TEMPLATE" | "UNKNOWN";
