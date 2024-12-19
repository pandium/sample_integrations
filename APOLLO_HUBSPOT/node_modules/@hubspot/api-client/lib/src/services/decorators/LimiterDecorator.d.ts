import Bottleneck from 'bottleneck';
import IDecorator from './IDecorator';
export default class LimiterDecorator implements IDecorator {
    protected limiter: Bottleneck | undefined;
    protected limiterJobOptions: Bottleneck.JobOptions;
    constructor(limiterOptions: Bottleneck.ConstructorOptions, limiterJobOptions?: Bottleneck.JobOptions);
    decorate(method: any): (...args: any) => any;
}
