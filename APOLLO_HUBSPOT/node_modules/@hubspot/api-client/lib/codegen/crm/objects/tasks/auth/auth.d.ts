import { RequestContext } from "../http/http";
export interface SecurityAuthentication {
    getName(): string;
    applySecurityAuthentication(context: RequestContext): void | Promise<void>;
}
export interface TokenProvider {
    getToken(): Promise<string> | string;
}
export declare class Oauth2Authentication implements SecurityAuthentication {
    private accessToken;
    constructor(accessToken: string);
    getName(): string;
    applySecurityAuthentication(context: RequestContext): void;
}
export type AuthMethods = {
    "default"?: SecurityAuthentication;
    "oauth2"?: SecurityAuthentication;
};
export type ApiKeyConfiguration = string;
export type HttpBasicConfiguration = {
    "username": string;
    "password": string;
};
export type HttpBearerConfiguration = {
    tokenProvider: TokenProvider;
};
export type OAuth2Configuration = {
    accessToken: string;
};
export type AuthMethodsConfiguration = {
    "default"?: SecurityAuthentication;
    "oauth2"?: OAuth2Configuration;
};
export declare function configureAuthMethods(config: AuthMethodsConfiguration | undefined): AuthMethods;
