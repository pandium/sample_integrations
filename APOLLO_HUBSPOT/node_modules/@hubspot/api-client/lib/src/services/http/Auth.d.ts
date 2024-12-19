import IConfiguration from '../../configuration/IConfiguration';
import { IHttpOptions } from './IHttpOptions';
export declare class Auth {
    static chooseAuth(opts?: IHttpOptions, config?: IConfiguration): string | undefined;
}
