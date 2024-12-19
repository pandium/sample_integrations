import { FilesApi, FoldersApi } from '../../../codegen/files/index';
import IConfiguration from '../../configuration/IConfiguration';
export default class FilesDiscovery {
    filesApi: FilesApi;
    foldersApi: FoldersApi;
    constructor(config?: IConfiguration);
}
