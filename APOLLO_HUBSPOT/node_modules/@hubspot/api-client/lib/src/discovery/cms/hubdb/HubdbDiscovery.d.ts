import { RowsApi, RowsBatchApi, TablesApi } from '../../../../codegen/cms/hubdb/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class HubdbDiscovery {
    rowsApi: RowsApi;
    rowsBatchApi: RowsBatchApi;
    tablesApi: TablesApi;
    constructor(config: IConfiguration);
}
