"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLocator = void 0;
class TaskLocator {
    static getAttributeTypeMap() {
        return TaskLocator.attributeTypeMap;
    }
    constructor() {
    }
}
exports.TaskLocator = TaskLocator;
TaskLocator.discriminator = undefined;
TaskLocator.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "links",
        "baseName": "links",
        "type": "{ [key: string]: string; }",
        "format": ""
    }
];
//# sourceMappingURL=TaskLocator.js.map