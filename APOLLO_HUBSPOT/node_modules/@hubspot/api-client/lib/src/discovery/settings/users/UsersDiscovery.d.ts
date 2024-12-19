import { RolesApi, TeamsApi, UsersApi } from '../../../../codegen/settings/users/index';
import IConfiguration from '../../../configuration/IConfiguration';
export default class UsersDiscovery {
    rolesApi: RolesApi;
    teamsApi: TeamsApi;
    usersApi: UsersApi;
    constructor(config: IConfiguration);
}
