import { CallbacksApi, DefinitionsApi, FunctionsApi, RevisionsApi } from '../../../../codegen/automation/actions/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class ActionsDiscovery {
    callbacksApi: CallbacksApi;
    definitionsApi: DefinitionsApi;
    functionsApi: FunctionsApi;
    revisionsApi: RevisionsApi;
    constructor(config: IConfiguration);
}
