"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTemplateTemplateTypeEnum = exports.ImportTemplate = void 0;
class ImportTemplate {
    static getAttributeTypeMap() {
        return ImportTemplate.attributeTypeMap;
    }
    constructor() {
    }
}
exports.ImportTemplate = ImportTemplate;
ImportTemplate.discriminator = undefined;
ImportTemplate.attributeTypeMap = [
    {
        "name": "templateType",
        "baseName": "templateType",
        "type": "ImportTemplateTemplateTypeEnum",
        "format": ""
    },
    {
        "name": "templateId",
        "baseName": "templateId",
        "type": "number",
        "format": "int32"
    }
];
var ImportTemplateTemplateTypeEnum;
(function (ImportTemplateTemplateTypeEnum) {
    ImportTemplateTemplateTypeEnum["AdminDefined"] = "admin_defined";
    ImportTemplateTemplateTypeEnum["PreviousImport"] = "previous_import";
    ImportTemplateTemplateTypeEnum["UserFile"] = "user_file";
})(ImportTemplateTemplateTypeEnum = exports.ImportTemplateTemplateTypeEnum || (exports.ImportTemplateTemplateTypeEnum = {}));
//# sourceMappingURL=ImportTemplate.js.map