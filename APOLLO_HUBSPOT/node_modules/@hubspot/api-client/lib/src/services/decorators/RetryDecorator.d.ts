import IDecorator from './IDecorator';
export default class RetryDecorator implements IDecorator {
    readonly tenSecondlyRolling = "TEN_SECONDLY_ROLLING";
    readonly secondlyLimitMessage = "You have reached your secondly limit.";
    readonly retryTimeout: {
        INTERNAL_SERVER_ERROR: number;
        TOO_MANY_REQUESTS: number;
        TOO_MANY_SEARCH_REQUESTS: number;
    };
    protected numberOfApiCallRetries: number;
    constructor(numberOfApiCallRetries: number);
    decorate(method: any): (...args: any) => any;
    protected _waitAfterRequestFailure(statusCode: number, retryNumber: number, retryTimeout: number): Promise<unknown>;
}
