import { DefinitionApi, StatusApi } from '../../../codegen/communication_preferences/index';
import IConfiguration from '../../configuration/IConfiguration';
export default class CommunicationPreferencesDiscovery {
    definitionApi: DefinitionApi;
    statusApi: StatusApi;
    constructor(config?: IConfiguration);
}
