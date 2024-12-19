"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSendStatusView = void 0;
class EmailSendStatusView {
    static getAttributeTypeMap() {
        return EmailSendStatusView.attributeTypeMap;
    }
    constructor() {
    }
}
exports.EmailSendStatusView = EmailSendStatusView;
EmailSendStatusView.discriminator = undefined;
EmailSendStatusView.attributeTypeMap = [
    {
        "name": "statusId",
        "baseName": "statusId",
        "type": "string",
        "format": ""
    },
    {
        "name": "sendResult",
        "baseName": "sendResult",
        "type": "EmailSendStatusViewSendResultEnum",
        "format": ""
    },
    {
        "name": "requestedAt",
        "baseName": "requestedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "startedAt",
        "baseName": "startedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "completedAt",
        "baseName": "completedAt",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "status",
        "baseName": "status",
        "type": "EmailSendStatusViewStatusEnum",
        "format": ""
    },
    {
        "name": "eventId",
        "baseName": "eventId",
        "type": "EventIdView",
        "format": ""
    }
];
//# sourceMappingURL=EmailSendStatusView.js.map