"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
class BlogPost {
    static getAttributeTypeMap() {
        return BlogPost.attributeTypeMap;
    }
    constructor() {
    }
}
exports.BlogPost = BlogPost;
BlogPost.discriminator = undefined;
BlogPost.attributeTypeMap = [
    {
        "name": "id",
        "baseName": "id",
        "type": "string",
        "format": ""
    },
    {
        "name": "slug",
        "baseName": "slug",
        "type": "string",
        "format": ""
    },
    {
        "name": "contentGroupId",
        "baseName": "contentGroupId",
        "type": "string",
        "format": ""
    },
    {
        "name": "campaign",
        "baseName": "campaign",
        "type": "string",
        "format": ""
    },
    {
        "name": "categoryId",
        "baseName": "categoryId",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "state",
        "baseName": "state",
        "type": "string",
        "format": ""
    },
    {
        "name": "name",
        "baseName": "name",
        "type": "string",
        "format": ""
    },
    {
        "name": "mabExperimentId",
        "baseName": "mabExperimentId",
        "type": "string",
        "format": ""
    },
    {
        "name": "archived",
        "baseName": "archived",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "authorName",
        "baseName": "authorName",
        "type": "string",
        "format": ""
    },
    {
        "name": "abTestId",
        "baseName": "abTestId",
        "type": "string",
        "format": ""
    },
    {
        "name": "createdById",
        "baseName": "createdById",
        "type": "string",
        "format": ""
    },
    {
        "name": "updatedById",
        "baseName": "updatedById",
        "type": "string",
        "format": ""
    },
    {
        "name": "domain",
        "baseName": "domain",
        "type": "string",
        "format": ""
    },
    {
        "name": "abStatus",
        "baseName": "abStatus",
        "type": "BlogPostAbStatusEnum",
        "format": ""
    },
    {
        "name": "folderId",
        "baseName": "folderId",
        "type": "string",
        "format": ""
    },
    {
        "name": "widgetContainers",
        "baseName": "widgetContainers",
        "type": "{ [key: string]: any; }",
        "format": ""
    },
    {
        "name": "widgets",
        "baseName": "widgets",
        "type": "{ [key: string]: any; }",
        "format": ""
    },
    {
        "name": "language",
        "baseName": "language",
        "type": "BlogPostLanguageEnum",
        "format": ""
    },
    {
        "name": "translatedFromId",
        "baseName": "translatedFromId",
        "type": "string",
        "format": ""
    },
    {
        "name": "translations",
        "baseName": "translations",
        "type": "{ [key: string]: ContentLanguageVariation; }",
        "format": ""
    },
    {
        "name": "dynamicPageDataSourceType",
        "baseName": "dynamicPageDataSourceType",
        "type": "number",
        "format": "int32"
    },
    {
        "name": "dynamicPageDataSourceId",
        "baseName": "dynamicPageDataSourceId",
        "type": "string",
        "format": ""
    },
    {
        "name": "blogAuthorId",
        "baseName": "blogAuthorId",
        "type": "string",
        "format": ""
    },
    {
        "name": "tagIds",
        "baseName": "tagIds",
        "type": "Array<number>",
        "format": "int64"
    },
    {
        "name": "htmlTitle",
        "baseName": "htmlTitle",
        "type": "string",
        "format": ""
    },
    {
        "name": "enableGoogleAmpOutputOverride",
        "baseName": "enableGoogleAmpOutputOverride",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "useFeaturedImage",
        "baseName": "useFeaturedImage",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "postBody",
        "baseName": "postBody",
        "type": "string",
        "format": ""
    },
    {
        "name": "postSummary",
        "baseName": "postSummary",
        "type": "string",
        "format": ""
    },
    {
        "name": "rssBody",
        "baseName": "rssBody",
        "type": "string",
        "format": ""
    },
    {
        "name": "rssSummary",
        "baseName": "rssSummary",
        "type": "string",
        "format": ""
    },
    {
        "name": "currentlyPublished",
        "baseName": "currentlyPublished",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "pageExpiryEnabled",
        "baseName": "pageExpiryEnabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "pageExpiryRedirectId",
        "baseName": "pageExpiryRedirectId",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "pageExpiryRedirectUrl",
        "baseName": "pageExpiryRedirectUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "pageExpiryDate",
        "baseName": "pageExpiryDate",
        "type": "number",
        "format": "int64"
    },
    {
        "name": "includeDefaultCustomCss",
        "baseName": "includeDefaultCustomCss",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableLayoutStylesheets",
        "baseName": "enableLayoutStylesheets",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "enableDomainStylesheets",
        "baseName": "enableDomainStylesheets",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "publishImmediately",
        "baseName": "publishImmediately",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "featuredImage",
        "baseName": "featuredImage",
        "type": "string",
        "format": ""
    },
    {
        "name": "featuredImageAltText",
        "baseName": "featuredImageAltText",
        "type": "string",
        "format": ""
    },
    {
        "name": "linkRelCanonicalUrl",
        "baseName": "linkRelCanonicalUrl",
        "type": "string",
        "format": ""
    },
    {
        "name": "contentTypeCategory",
        "baseName": "contentTypeCategory",
        "type": "BlogPostContentTypeCategoryEnum",
        "format": ""
    },
    {
        "name": "attachedStylesheets",
        "baseName": "attachedStylesheets",
        "type": "Array<{ [key: string]: any; }>",
        "format": ""
    },
    {
        "name": "metaDescription",
        "baseName": "metaDescription",
        "type": "string",
        "format": ""
    },
    {
        "name": "headHtml",
        "baseName": "headHtml",
        "type": "string",
        "format": ""
    },
    {
        "name": "footerHtml",
        "baseName": "footerHtml",
        "type": "string",
        "format": ""
    },
    {
        "name": "archivedInDashboard",
        "baseName": "archivedInDashboard",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "publicAccessRulesEnabled",
        "baseName": "publicAccessRulesEnabled",
        "type": "boolean",
        "format": ""
    },
    {
        "name": "publicAccessRules",
        "baseName": "publicAccessRules",
        "type": "Array<any>",
        "format": ""
    },
    {
        "name": "layoutSections",
        "baseName": "layoutSections",
        "type": "{ [key: string]: LayoutSection; }",
        "format": ""
    },
    {
        "name": "themeSettingsValues",
        "baseName": "themeSettingsValues",
        "type": "{ [key: string]: any; }",
        "format": ""
    },
    {
        "name": "url",
        "baseName": "url",
        "type": "string",
        "format": ""
    },
    {
        "name": "password",
        "baseName": "password",
        "type": "string",
        "format": ""
    },
    {
        "name": "currentState",
        "baseName": "currentState",
        "type": "BlogPostCurrentStateEnum",
        "format": ""
    },
    {
        "name": "publishDate",
        "baseName": "publishDate",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "created",
        "baseName": "created",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "updated",
        "baseName": "updated",
        "type": "Date",
        "format": "date-time"
    },
    {
        "name": "deletedAt",
        "baseName": "deletedAt",
        "type": "Date",
        "format": "date-time"
    }
];
//# sourceMappingURL=BlogPost.js.map