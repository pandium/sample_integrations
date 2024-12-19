import { PublicSmtpTokensApi, SingleSendApi } from '../../../../codegen/marketing/transactional/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class TransactionalDiscovery {
    publicSmtpTokensApi: PublicSmtpTokensApi;
    singleSendApi: SingleSendApi;
    constructor(config: IConfiguration);
}
