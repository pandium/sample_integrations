interface IAPIType<CollectionType, ConfigurationType> {
    getPage(limit?: number, after?: string, properties?: string[], propertiesWithHistory?: string[], associations?: string[], archived?: boolean, _options?: ConfigurationType): Promise<CollectionType>;
}
interface INextPage {
    after: string;
}
interface IForwardPaging {
    next?: INextPage;
}
interface ICollectionType<ObjectType> {
    results: ObjectType[];
    paging?: IForwardPaging;
}
export declare function getAll<ReturnType, ConfigurationType>(api: IAPIType<ICollectionType<ReturnType>, ConfigurationType>, limit?: number, after?: string, properties?: string[], propertiesWithHistory?: string[], associations?: string[], archived?: boolean): Promise<ReturnType[]>;
export {};
