import { CoreApi, PublicImportsApi } from '../../../../codegen/crm/imports/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class ImportsDiscovery {
    coreApi: CoreApi;
    publicImportsApi: PublicImportsApi;
    constructor(config: IConfiguration);
}
