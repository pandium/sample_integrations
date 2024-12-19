"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputFieldDefinition = void 0;
class InputFieldDefinition {
    static getAttributeTypeMap() {
        return InputFieldDefinition.attributeTypeMap;
    }
    constructor() {
    }
}
exports.InputFieldDefinition = InputFieldDefinition;
InputFieldDefinition.discriminator = undefined;
InputFieldDefinition.attributeTypeMap = [
    {
        "name": "typeDefinition",
        "baseName": "typeDefinition",
        "type": "FieldTypeDefinition",
        "format": ""
    },
    {
        "name": "supportedValueTypes",
        "baseName": "supportedValueTypes",
        "type": "Array<InputFieldDefinitionSupportedValueTypesEnum>",
        "format": ""
    },
    {
        "name": "isRequired",
        "baseName": "isRequired",
        "type": "boolean",
        "format": ""
    }
];
//# sourceMappingURL=InputFieldDefinition.js.map