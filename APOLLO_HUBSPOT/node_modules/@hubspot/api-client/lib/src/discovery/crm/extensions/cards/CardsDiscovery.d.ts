import { CardsApi, SampleResponseApi } from '../../../../../codegen/crm/extensions/cards/index';
import IConfiguration from '../../../../configuration/IConfiguration';
export default class CardsDiscovery {
    cardsApi: CardsApi;
    sampleResponseApi: SampleResponseApi;
    constructor(config: IConfiguration);
}
