import { BatchApi } from '../../../../codegen/crm/associations/index';
import IConfiguration from '../../../configuration/IConfiguration';
import BaseDiscovery from '../../BaseDiscovery';
import type SchemaDiscovery from './schema/SchemaDiscovery';
import type AssociationsV4Discovery from './v4/AssociationsDiscovery';
export default class AssociationsDiscovery extends BaseDiscovery {
    batchApi: BatchApi;
    protected _schema: SchemaDiscovery | undefined;
    protected _v4: AssociationsV4Discovery | undefined;
    constructor(config: IConfiguration);
    get schema(): SchemaDiscovery;
    get v4(): AssociationsV4Discovery;
}
