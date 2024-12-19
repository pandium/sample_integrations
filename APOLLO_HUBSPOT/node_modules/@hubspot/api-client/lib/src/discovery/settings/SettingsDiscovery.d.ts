import BaseDiscovery from '../BaseDiscovery';
import type BusinessUnitsDiscovery from './business_units/BusinessUnitsDiscovery';
import type UsersDiscovery from './users/UsersDiscovery';
export default class SettingsDiscovery extends BaseDiscovery {
    protected _businessUnits: BusinessUnitsDiscovery | undefined;
    protected _users: UsersDiscovery | undefined;
    get businessUnits(): BusinessUnitsDiscovery;
    get users(): UsersDiscovery;
}
