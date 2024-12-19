"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bottleneck_1 = __importDefault(require("bottleneck"));
class LimiterDecorator {
    constructor(limiterOptions, limiterJobOptions = {}) {
        this.limiter = new bottleneck_1.default(limiterOptions);
        this.limiterJobOptions = limiterJobOptions;
    }
    decorate(method) {
        return (...args) => {
            if (!this.limiter) {
                throw new Error('Limiter not defined');
            }
            if (this.limiterJobOptions) {
                return this.limiter.schedule(this.limiterJobOptions, () => method(...args));
            }
            else {
                return this.limiter.wrap(method);
            }
        };
    }
}
exports.default = LimiterDecorator;
//# sourceMappingURL=LimiterDecorator.js.map