"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = __importDefault(require("lodash.get"));
const StatusCodes_1 = require("../http/StatusCodes");
class RetryDecorator {
    constructor(numberOfApiCallRetries) {
        this.tenSecondlyRolling = 'TEN_SECONDLY_ROLLING';
        this.secondlyLimitMessage = 'You have reached your secondly limit.';
        this.retryTimeout = {
            INTERNAL_SERVER_ERROR: 200,
            TOO_MANY_REQUESTS: 10 * 1000,
            TOO_MANY_SEARCH_REQUESTS: 1000,
        };
        this.numberOfApiCallRetries = numberOfApiCallRetries;
    }
    decorate(method) {
        return (...args) => __awaiter(this, void 0, void 0, function* () {
            const numberOfRetries = this.numberOfApiCallRetries;
            let resultSuccess;
            let resultRejected;
            for (let index = 1; index <= this.numberOfApiCallRetries; index++) {
                try {
                    resultSuccess = yield method(...args);
                    resultRejected = null;
                    break;
                }
                catch (e) {
                    resultRejected = e;
                    if (index === numberOfRetries) {
                        break;
                    }
                    const statusCode = (0, lodash_get_1.default)(e, 'code', 0);
                    if (statusCode >= StatusCodes_1.StatusCodes.MinServerError && statusCode <= StatusCodes_1.StatusCodes.MaxServerError) {
                        yield this._waitAfterRequestFailure(statusCode, index, this.retryTimeout.INTERNAL_SERVER_ERROR);
                        continue;
                    }
                    if (statusCode === StatusCodes_1.StatusCodes.TooManyRequests) {
                        const policyName = (0, lodash_get_1.default)(e, 'body.policyName');
                        if (policyName === this.tenSecondlyRolling) {
                            yield this._waitAfterRequestFailure(statusCode, index, this.retryTimeout.TOO_MANY_REQUESTS);
                            continue;
                        }
                        const message = (0, lodash_get_1.default)(e, 'body.message');
                        if (message === this.secondlyLimitMessage) {
                            yield this._waitAfterRequestFailure(statusCode, index, this.retryTimeout.TOO_MANY_SEARCH_REQUESTS);
                            continue;
                        }
                    }
                    break;
                }
            }
            return new Promise((resolve, reject) => {
                if (resultRejected) {
                    return reject(resultRejected);
                }
                return resolve(resultSuccess);
            });
        });
    }
    _waitAfterRequestFailure(statusCode, retryNumber, retryTimeout) {
        console.error(`Request failed with status code [${statusCode}], will retry [${retryNumber}] time in [${retryTimeout}] ms`);
        return new Promise((resolve) => setTimeout(resolve, retryTimeout * retryNumber));
    }
}
exports.default = RetryDecorator;
//# sourceMappingURL=RetryDecorator.js.map