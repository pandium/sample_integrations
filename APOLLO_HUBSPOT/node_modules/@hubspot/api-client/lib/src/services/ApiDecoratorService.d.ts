import IDecorator from './decorators/IDecorator';
export default class ApiDecoratorService {
    static getInstance(): ApiDecoratorService;
    protected static instance: ApiDecoratorService;
    protected decorators: IDecorator[];
    protected constructor();
    setDecorators(decorators: IDecorator[]): void;
    apply<APIClass>(api: any): APIClass;
    applyToMethod(method: any): any;
}
