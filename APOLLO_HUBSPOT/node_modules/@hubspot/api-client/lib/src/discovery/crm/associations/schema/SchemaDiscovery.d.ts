import { TypesApi } from '../../../../../codegen/crm/associations/schema/index';
import IConfiguration from '../../../../configuration/IConfiguration';
import BaseDiscovery from '../../../BaseDiscovery';
export default class SchemaDiscovery extends BaseDiscovery {
    typesApi: TypesApi;
    constructor(config: IConfiguration);
}
