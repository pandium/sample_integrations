import { BatchApi, CoreApi, GroupsApi } from '../../../../codegen/crm/properties/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class PropertiesDiscovery {
    batchApi: BatchApi;
    coreApi: CoreApi;
    groupsApi: GroupsApi;
    constructor(config: IConfiguration);
}
