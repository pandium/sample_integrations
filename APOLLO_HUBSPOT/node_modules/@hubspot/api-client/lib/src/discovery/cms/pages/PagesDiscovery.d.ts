import { LandingPagesApi, SitePagesApi } from '../../../../codegen/cms/pages/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class PagesDiscovery {
    landingPagesApi: LandingPagesApi;
    sitePagesApi: SitePagesApi;
    constructor(config: IConfiguration);
}
