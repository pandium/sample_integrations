import { EventsApi, TemplatesApi, TokensApi } from '../../../../codegen/crm/timeline/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class TimelineDiscovery {
    eventsApi: EventsApi;
    templatesApi: TemplatesApi;
    tokensApi: TokensApi;
    constructor(config: IConfiguration);
}
