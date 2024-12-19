/// <reference types="node" />
import IConfiguration from '../../configuration/IConfiguration';
import { IHttpOptions } from './IHttpOptions';
export interface IHeaders {
    [key: string]: string;
}
export declare class Request {
    protected opts: IHttpOptions;
    protected config: IConfiguration;
    protected baseUrl: string;
    protected url: URL;
    protected method: string;
    protected headers: IHeaders;
    protected body?: any;
    constructor(config?: IConfiguration, opts?: IHttpOptions);
    getSendData(): {
        method: string;
        headers: IHeaders;
    };
    getUrl(): URL;
    protected applyAuth(): void;
    protected initHeaders(): void;
    protected getDefaultHeaders(): IHeaders;
    protected generateUrl(): URL;
    protected setBody(): void;
}
