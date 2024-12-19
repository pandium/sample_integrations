import { Request } from './Request';
export declare class HttpClient {
    static send(request: Request): Promise<import("node-fetch").Response>;
}
