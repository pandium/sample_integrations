import { AuditLogsApi } from '../../../../codegen/cms/audit_logs/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class AuditLogsDiscovery {
    auditLogsApi: AuditLogsApi;
    constructor(config: IConfiguration);
}
