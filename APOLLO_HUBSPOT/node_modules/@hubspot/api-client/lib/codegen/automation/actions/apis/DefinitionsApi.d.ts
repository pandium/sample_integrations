import { BaseAPIRequestFactory } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, ResponseContext } from '../http/http';
import { CollectionResponseExtensionActionDefinitionForwardPaging } from '../models/CollectionResponseExtensionActionDefinitionForwardPaging';
import { ExtensionActionDefinition } from '../models/ExtensionActionDefinition';
import { ExtensionActionDefinitionInput } from '../models/ExtensionActionDefinitionInput';
import { ExtensionActionDefinitionPatch } from '../models/ExtensionActionDefinitionPatch';
export declare class DefinitionsApiRequestFactory extends BaseAPIRequestFactory {
    archive(definitionId: string, appId: number, _options?: Configuration): Promise<RequestContext>;
    create(appId: number, extensionActionDefinitionInput: ExtensionActionDefinitionInput, _options?: Configuration): Promise<RequestContext>;
    getById(definitionId: string, appId: number, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    getPage(appId: number, limit?: number, after?: string, archived?: boolean, _options?: Configuration): Promise<RequestContext>;
    update(definitionId: string, appId: number, extensionActionDefinitionPatch: ExtensionActionDefinitionPatch, _options?: Configuration): Promise<RequestContext>;
}
export declare class DefinitionsApiResponseProcessor {
    archive(response: ResponseContext): Promise<void>;
    create(response: ResponseContext): Promise<ExtensionActionDefinition>;
    getById(response: ResponseContext): Promise<ExtensionActionDefinition>;
    getPage(response: ResponseContext): Promise<CollectionResponseExtensionActionDefinitionForwardPaging>;
    update(response: ResponseContext): Promise<ExtensionActionDefinition>;
}
