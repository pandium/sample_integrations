import { CoreApi, PublicObjectSchemasApi } from '../../../../codegen/crm/schemas/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class SchemasDiscovery {
    coreApi: CoreApi;
    publicObjectSchemasApi: PublicObjectSchemasApi;
    constructor(config: IConfiguration);
}
