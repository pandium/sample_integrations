export declare function isTruthy(value: string): boolean;
export declare class Config {
    [key: string]: string;
    constructor();
}
export declare class Secret {
    [key: string]: string;
    constructor();
}
export declare class Context {
    [key: string]: string;
    constructor();
}
export interface WebhookPayload {
    body: any;
    headers: any;
}
