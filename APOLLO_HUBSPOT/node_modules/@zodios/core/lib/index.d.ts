import * as axios from 'axios';
import { AxiosInstance } from 'axios';
import { ZodiosPlugin, ZodiosOptions, ZodiosEndpointDefinitions, Aliases, Method, ZodiosPathsByMethod, ZodiosRequestOptions, ZodiosResponseByPath, ZodiosRequestOptionsByPath, ZodiosBodyByPath, ZodiosAliases, ZodiosMatchingErrorsByPath, ZodiosMatchingErrorsByAlias, ZodiosEndpointParameter, ZodiosEndpointError, ZodiosEndpointDefinition } from './zodios.types.js';
export { AnyZodiosMethodOptions, AnyZodiosRequestOptions, Method, ZodiosBodyByAlias, ZodiosBodyByPath, ZodiosBodyForEndpoint, ZodiosEndpointDefinition, ZodiosEndpointDefinitionByAlias, ZodiosEndpointDefinitionByPath, ZodiosEndpointDefinitions, ZodiosEndpointError, ZodiosEndpointErrors, ZodiosEndpointParameter, ZodiosEndpointParameters, ZodiosErrorByAlias, ZodiosErrorByPath, ZodiosErrorForEndpoint, ZodiosHeaderParamsByAlias, ZodiosHeaderParamsByPath, ZodiosHeaderParamsForEndpoint, ZodiosMethodOptions, ZodiosOptions, ZodiosPathParamByAlias, ZodiosPathParams, ZodiosPathParamsByPath, ZodiosPathParamsForEndpoint, ZodiosPathsByMethod, ZodiosPlugin, ZodiosQueryParamsByAlias, ZodiosQueryParamsByPath, ZodiosQueryParamsForEndpoint, ZodiosRequestOptions, ZodiosRequestOptionsByAlias, ZodiosRequestOptionsByPath, ZodiosResponseByAlias, ZodiosResponseByPath, ZodiosResponseForEndpoint } from './zodios.types.js';
import { PickRequired, Narrow, ReadonlyDeep, RequiredKeys, UndefinedIfNever, DeepReadonlyObject, UnionToTuple, TupleFlat } from './utils.types.js';
import z from 'zod';

/**
 * form-data plugin used internally by Zodios.
 * @example
 * ```typescript
 *   const apiClient = new Zodios(
 *     "https://mywebsite.com",
 *     [{
 *       method: "post",
 *       path: "/upload",
 *       alias: "upload",
 *       description: "Upload a file",
 *       requestFormat: "form-data",
 *       parameters:[
 *         {
 *           name: "body",
 *           type: "Body",
 *           schema: z.object({
 *             file: z.instanceof(File),
 *           }),
 *         }
 *       ],
 *       response: z.object({
 *         id: z.number(),
 *       }),
 *     }],
 *   );
 *   const id = await apiClient.upload({ file: document.querySelector('#file').files[0] });
 * ```
 * @returns form-data plugin
 */
declare function formDataPlugin(): ZodiosPlugin;

/**
 * form-url plugin used internally by Zodios.
 * @example
 * ```typescript
 *   const apiClient = new Zodios(
 *     "https://mywebsite.com",
 *     [{
 *       method: "post",
 *       path: "/login",
 *       alias: "login",
 *       description: "Submit a form",
 *       requestFormat: "form-url",
 *       parameters:[
 *         {
 *           name: "body",
 *           type: "Body",
 *           schema: z.object({
 *             userName: z.string(),
 *             password: z.string(),
 *           }),
 *         }
 *       ],
 *       response: z.object({
 *         id: z.number(),
 *       }),
 *     }],
 *   );
 *   const id = await apiClient.login({ userName: "user", password: "password" });
 * ```
 * @returns form-url plugin
 */
declare function formURLPlugin(): ZodiosPlugin;

declare function headerPlugin(key: string, value: string): ZodiosPlugin;

type Options = Required<Pick<ZodiosOptions, "validate" | "transform" | "sendDefaults">>;
/**
 * Zod validation plugin used internally by Zodios.
 * By default zodios always validates the response.
 * @returns zod-validation plugin
 */
declare function zodValidationPlugin({ validate, transform, sendDefaults, }: Options): ZodiosPlugin;

type PluginId = {
    key: string;
    value: number;
};

/**
 * zodios api client based on axios
 */
declare class ZodiosClass<Api extends ZodiosEndpointDefinitions> {
    private axiosInstance;
    readonly options: PickRequired<ZodiosOptions, "validate" | "transform" | "sendDefaults">;
    readonly api: Api;
    private endpointPlugins;
    /**
     * constructor
     * @param baseURL - the base url to use - if omited will use the browser domain
     * @param api - the description of all the api endpoints
     * @param options - the options to setup the client API
     * @example
     *   const apiClient = new Zodios("https://jsonplaceholder.typicode.com", [
     *     {
     *       method: "get",
     *       path: "/users",
     *       description: "Get all users",
     *       parameters: [
     *         {
     *           name: "q",
     *           type: "Query",
     *           schema: z.string(),
     *         },
     *         {
     *           name: "page",
     *           type: "Query",
     *           schema: z.string().optional(),
     *         },
     *       ],
     *       response: z.array(z.object({ id: z.number(), name: z.string() })),
     *     }
     *   ]);
     */
    constructor(api: Narrow<Api>, options?: ZodiosOptions);
    constructor(baseUrl: string, api: Narrow<Api>, options?: ZodiosOptions);
    private initPlugins;
    private getAnyEndpointPlugins;
    private findAliasEndpointPlugins;
    private findEnpointPlugins;
    /**
     * get the base url of the api
     */
    get baseURL(): string | undefined;
    /**
     * get the underlying axios instance
     */
    get axios(): AxiosInstance;
    /**
     * register a plugin to intercept the requests or responses
     * @param plugin - the plugin to use
     * @returns an id to allow you to unregister the plugin
     */
    use(plugin: ZodiosPlugin): PluginId;
    use<Alias extends Aliases<Api>>(alias: Alias, plugin: ZodiosPlugin): PluginId;
    use<M extends Method, Path extends ZodiosPathsByMethod<Api, M>>(method: M, path: Path, plugin: ZodiosPlugin): PluginId;
    /**
     * unregister a plugin
     * if the plugin name is provided instead of the registration plugin id,
     * it will unregister the plugin with that name only for non endpoint plugins
     * @param plugin - id of the plugin to remove
     */
    eject(plugin: PluginId | string): void;
    private injectAliasEndpoints;
    /**
     * make a request to the api
     * @param config - the config to setup zodios options and parameters
     * @returns response validated with zod schema provided in the api description
     */
    request<M extends Method, Path extends string>(config: Path extends ZodiosPathsByMethod<Api, M> ? ReadonlyDeep<ZodiosRequestOptions<Api, M, Path>> : ReadonlyDeep<ZodiosRequestOptions<Api, M, ZodiosPathsByMethod<Api, M>>>): Promise<ZodiosResponseByPath<Api, M, Path extends ZodiosPathsByMethod<Api, M> ? Path : never>>;
    /**
     * make a get request to the api
     * @param path - the path to api endpoint
     * @param config - the config to setup axios options and parameters
     * @returns response validated with zod schema provided in the api description
     */
    get<Path extends ZodiosPathsByMethod<Api, "get">, TConfig extends ZodiosRequestOptionsByPath<Api, "get", Path>>(path: Path, ...[config]: RequiredKeys<TConfig> extends never ? [config?: ReadonlyDeep<TConfig>] : [config: ReadonlyDeep<TConfig>]): Promise<ZodiosResponseByPath<Api, "get", Path>>;
    /**
     * make a post request to the api
     * @param path - the path to api endpoint
     * @param data - the data to send
     * @param config - the config to setup axios options and parameters
     * @returns response validated with zod schema provided in the api description
     */
    post<Path extends ZodiosPathsByMethod<Api, "post">, TConfig extends ZodiosRequestOptionsByPath<Api, "post", Path>>(path: Path, data: ReadonlyDeep<UndefinedIfNever<ZodiosBodyByPath<Api, "post", Path>>>, ...[config]: RequiredKeys<TConfig> extends never ? [config?: ReadonlyDeep<TConfig>] : [config: ReadonlyDeep<TConfig>]): Promise<ZodiosResponseByPath<Api, "post", Path>>;
    /**
     * make a put request to the api
     * @param path - the path to api endpoint
     * @param data - the data to send
     * @param config - the config to setup axios options and parameters
     * @returns response validated with zod schema provided in the api description
     */
    put<Path extends ZodiosPathsByMethod<Api, "put">, TConfig extends ZodiosRequestOptionsByPath<Api, "put", Path>>(path: Path, data: ReadonlyDeep<UndefinedIfNever<ZodiosBodyByPath<Api, "put", Path>>>, ...[config]: RequiredKeys<TConfig> extends never ? [config?: ReadonlyDeep<TConfig>] : [config: ReadonlyDeep<TConfig>]): Promise<ZodiosResponseByPath<Api, "put", Path>>;
    /**
     * make a patch request to the api
     * @param path - the path to api endpoint
     * @param data - the data to send
     * @param config - the config to setup axios options and parameters
     * @returns response validated with zod schema provided in the api description
     */
    patch<Path extends ZodiosPathsByMethod<Api, "patch">, TConfig extends ZodiosRequestOptionsByPath<Api, "patch", Path>>(path: Path, data: ReadonlyDeep<UndefinedIfNever<ZodiosBodyByPath<Api, "patch", Path>>>, ...[config]: RequiredKeys<TConfig> extends never ? [config?: ReadonlyDeep<TConfig>] : [config: ReadonlyDeep<TConfig>]): Promise<ZodiosResponseByPath<Api, "patch", Path>>;
    /**
     * make a delete request to the api
     * @param path - the path to api endpoint
     * @param config - the config to setup axios options and parameters
     * @returns response validated with zod schema provided in the api description
     */
    delete<Path extends ZodiosPathsByMethod<Api, "delete">, TConfig extends ZodiosRequestOptionsByPath<Api, "delete", Path>>(path: Path, data: ReadonlyDeep<UndefinedIfNever<ZodiosBodyByPath<Api, "delete", Path>>>, ...[config]: RequiredKeys<TConfig> extends never ? [config?: ReadonlyDeep<TConfig>] : [config: ReadonlyDeep<TConfig>]): Promise<ZodiosResponseByPath<Api, "delete", Path>>;
}
type ZodiosInstance<Api extends ZodiosEndpointDefinitions> = ZodiosClass<Api> & ZodiosAliases<Api>;
type ZodiosConstructor = {
    new <Api extends ZodiosEndpointDefinitions>(api: Narrow<Api>, options?: ZodiosOptions): ZodiosInstance<Api>;
    new <Api extends ZodiosEndpointDefinitions>(baseUrl: string, api: Narrow<Api>, options?: ZodiosOptions): ZodiosInstance<Api>;
};
declare const Zodios: ZodiosConstructor;
/**
 * Get the Api description type from zodios
 * @param Z - zodios type
 */
type ApiOf<Z> = Z extends ZodiosInstance<infer Api> ? Api : never;

/**
 * Custom Zodios Error with additional information
 * @param message - the error message
 * @param data - the parameter or response object that caused the error
 * @param config - the config object from zodios
 * @param cause - the error cause
 */
declare class ZodiosError extends Error {
    readonly config?: DeepReadonlyObject<{
        method: Method;
        url: string;
        params?: Record<string, unknown> | undefined;
        queries?: Record<string, unknown> | undefined;
        headers?: Record<string, string> | undefined;
        baseURL?: string | undefined;
        data?: unknown;
        transformRequest?: axios.AxiosRequestTransformer | axios.AxiosRequestTransformer[] | undefined;
        transformResponse?: axios.AxiosResponseTransformer | axios.AxiosResponseTransformer[] | undefined;
        paramsSerializer?: axios.ParamsSerializerOptions | axios.CustomParamsSerializer | undefined;
        timeout?: number | undefined;
        timeoutErrorMessage?: string | undefined;
        withCredentials?: boolean | undefined;
        adapter?: (string | axios.AxiosAdapter) | (string | axios.AxiosAdapter)[] | undefined;
        auth?: axios.AxiosBasicCredentials | undefined;
        responseType?: axios.ResponseType | undefined;
        responseEncoding?: string | undefined;
        xsrfCookieName?: string | undefined;
        xsrfHeaderName?: string | undefined;
        onUploadProgress?: ((progressEvent: axios.AxiosProgressEvent) => void) | undefined;
        onDownloadProgress?: ((progressEvent: axios.AxiosProgressEvent) => void) | undefined;
        maxContentLength?: number | undefined;
        validateStatus?: ((status: number) => boolean) | null | undefined;
        maxBodyLength?: number | undefined;
        maxRedirects?: number | undefined;
        maxRate?: number | [number, number] | undefined;
        beforeRedirect?: ((options: Record<string, any>, responseDetails: {
            headers: Record<string, string>;
        }) => void) | undefined;
        socketPath?: string | null | undefined;
        transport?: any;
        httpAgent?: any;
        httpsAgent?: any;
        proxy?: false | axios.AxiosProxyConfig | undefined;
        cancelToken?: axios.CancelToken | undefined;
        decompress?: boolean | undefined;
        transitional?: axios.TransitionalOptions | undefined;
        signal?: axios.GenericAbortSignal | undefined;
        insecureHTTPParser?: boolean | undefined;
        env?: {
            FormData?: (new (...args: any[]) => object) | undefined;
        } | undefined;
        formSerializer?: axios.FormSerializerOptions | undefined;
        family?: 6 | 4 | undefined;
        lookup?: ((hostname: string, options: object, cb: (err: Error | null, address: string, family: number) => void) => void) | ((hostname: string, options: object) => Promise<string | [address: string, family: number]>) | undefined;
    }> | undefined;
    readonly data?: unknown;
    readonly cause?: Error | undefined;
    constructor(message: string, config?: DeepReadonlyObject<{
        method: Method;
        url: string;
        params?: Record<string, unknown> | undefined;
        queries?: Record<string, unknown> | undefined;
        headers?: Record<string, string> | undefined;
        baseURL?: string | undefined;
        data?: unknown;
        transformRequest?: axios.AxiosRequestTransformer | axios.AxiosRequestTransformer[] | undefined;
        transformResponse?: axios.AxiosResponseTransformer | axios.AxiosResponseTransformer[] | undefined;
        paramsSerializer?: axios.ParamsSerializerOptions | axios.CustomParamsSerializer | undefined;
        timeout?: number | undefined;
        timeoutErrorMessage?: string | undefined;
        withCredentials?: boolean | undefined;
        adapter?: (string | axios.AxiosAdapter) | (string | axios.AxiosAdapter)[] | undefined;
        auth?: axios.AxiosBasicCredentials | undefined;
        responseType?: axios.ResponseType | undefined;
        responseEncoding?: string | undefined;
        xsrfCookieName?: string | undefined;
        xsrfHeaderName?: string | undefined;
        onUploadProgress?: ((progressEvent: axios.AxiosProgressEvent) => void) | undefined;
        onDownloadProgress?: ((progressEvent: axios.AxiosProgressEvent) => void) | undefined;
        maxContentLength?: number | undefined;
        validateStatus?: ((status: number) => boolean) | null | undefined;
        maxBodyLength?: number | undefined;
        maxRedirects?: number | undefined;
        maxRate?: number | [number, number] | undefined;
        beforeRedirect?: ((options: Record<string, any>, responseDetails: {
            headers: Record<string, string>;
        }) => void) | undefined;
        socketPath?: string | null | undefined;
        transport?: any;
        httpAgent?: any;
        httpsAgent?: any;
        proxy?: false | axios.AxiosProxyConfig | undefined;
        cancelToken?: axios.CancelToken | undefined;
        decompress?: boolean | undefined;
        transitional?: axios.TransitionalOptions | undefined;
        signal?: axios.GenericAbortSignal | undefined;
        insecureHTTPParser?: boolean | undefined;
        env?: {
            FormData?: (new (...args: any[]) => object) | undefined;
        } | undefined;
        formSerializer?: axios.FormSerializerOptions | undefined;
        family?: 6 | 4 | undefined;
        lookup?: ((hostname: string, options: object, cb: (err: Error | null, address: string, family: number) => void) => void) | ((hostname: string, options: object) => Promise<string | [address: string, family: number]>) | undefined;
    }> | undefined, data?: unknown, cause?: Error | undefined);
}

/**
 * check if the error is matching the endpoint errors definitions
 * @param api - the api definition
 * @param method - http method of the endpoint
 * @param path - path of the endpoint
 * @param error - the error to check
 * @returns - if true, the error type is narrowed to the matching endpoint errors
 */
declare function isErrorFromPath<Api extends ZodiosEndpointDefinitions, M extends Method, Path extends string>(api: Api, method: M, path: Path extends ZodiosPathsByMethod<Api, M> ? Path : ZodiosPathsByMethod<Api, M>, error: unknown): error is ZodiosMatchingErrorsByPath<Api, M, Path extends ZodiosPathsByMethod<Api, M> ? Path : never>;
/**
 * check if the error is matching the endpoint errors definitions
 * @param api - the api definition
 * @param alias - alias of the endpoint
 * @param error - the error to check
 * @returns - if true, the error type is narrowed to the matching endpoint errors
 */
declare function isErrorFromAlias<Api extends ZodiosEndpointDefinitions, Alias extends string>(api: Api, alias: Alias extends Aliases<Api> ? Alias : Aliases<Api>, error: unknown): error is ZodiosMatchingErrorsByAlias<Api, Alias>;

/**
 * check api for non unique paths
 * @param api - api to check
 * @return - nothing
 * @throws - error if api has non unique paths
 */
declare function checkApi<T extends ZodiosEndpointDefinitions>(api: T): void;
/**
 * Simple helper to split your api definitions into multiple files
 * Mandatory to be used when declaring your endpoint definitions outside zodios constructor
 * to enable type inferrence and autocompletion
 * @param api - api definitions
 * @returns the api definitions
 */
declare function makeApi<Api extends ZodiosEndpointDefinitions>(api: Narrow<Api>): Api;
/**
 * Simple helper to split your parameter definitions into multiple files
 * Mandatory to be used when declaring parameters appart from your endpoint definitions
 * to enable type inferrence and autocompletion
 * @param params - api parameter definitions
 * @returns the api parameter definitions
 */
declare function makeParameters<ParameterDescriptions extends ZodiosEndpointParameter[]>(params: Narrow<ParameterDescriptions>): ParameterDescriptions;
declare function parametersBuilder(): ParametersBuilder<[]>;
type ObjectToQueryParameters<Type extends "Query" | "Path" | "Header", T extends Record<string, z.ZodType<any, any, any>>, Keys = UnionToTuple<keyof T>> = {
    [Index in keyof Keys]: {
        name: Keys[Index];
        type: Type;
        description?: string;
        schema: T[Extract<Keys[Index], keyof T>];
    };
};
declare class ParametersBuilder<T extends ZodiosEndpointParameter[]> {
    private params;
    constructor(params: T);
    addParameter<Name extends string, Type extends "Path" | "Query" | "Body" | "Header", Schema extends z.ZodType<any, any, any>>(name: Name, type: Type, schema: Schema): ParametersBuilder<[...T, {
        name: Name;
        type: Type;
        description?: string | undefined;
        schema: Schema;
    }]>;
    addParameters<Type extends "Query" | "Path" | "Header", Schemas extends Record<string, z.ZodType<any, any, any>>>(type: Type, schemas: Schemas): ParametersBuilder<[...T, ...Extract<ObjectToQueryParameters<Type, Schemas, UnionToTuple<keyof Schemas, []>>, ZodiosEndpointParameter[]>]>;
    addBody<Schema extends z.ZodType<any, any, any>>(schema: Schema): ParametersBuilder<[...T, {
        name: "body";
        type: "Body";
        description?: string | undefined;
        schema: Schema;
    }]>;
    addQuery<Name extends string, Schema extends z.ZodType<any, any, any>>(name: Name, schema: Schema): ParametersBuilder<[...T, {
        name: Name;
        type: "Query";
        description?: string | undefined;
        schema: Schema;
    }]>;
    addPath<Name extends string, Schema extends z.ZodType<any, any, any>>(name: Name, schema: Schema): ParametersBuilder<[...T, {
        name: Name;
        type: "Path";
        description?: string | undefined;
        schema: Schema;
    }]>;
    addHeader<Name extends string, Schema extends z.ZodType<any, any, any>>(name: Name, schema: Schema): ParametersBuilder<[...T, {
        name: Name;
        type: "Header";
        description?: string | undefined;
        schema: Schema;
    }]>;
    addQueries<Schemas extends Record<string, z.ZodType<any, any, any>>>(schemas: Schemas): ParametersBuilder<[...T, ...Extract<ObjectToQueryParameters<"Query", Schemas, UnionToTuple<keyof Schemas, []>>, ZodiosEndpointParameter[]>]>;
    addPaths<Schemas extends Record<string, z.ZodType<any, any, any>>>(schemas: Schemas): ParametersBuilder<[...T, ...Extract<ObjectToQueryParameters<"Path", Schemas, UnionToTuple<keyof Schemas, []>>, ZodiosEndpointParameter[]>]>;
    addHeaders<Schemas extends Record<string, z.ZodType<any, any, any>>>(schemas: Schemas): ParametersBuilder<[...T, ...Extract<ObjectToQueryParameters<"Header", Schemas, UnionToTuple<keyof Schemas, []>>, ZodiosEndpointParameter[]>]>;
    build(): T;
}
/**
 * Simple helper to split your error definitions into multiple files
 * Mandatory to be used when declaring errors appart from your endpoint definitions
 * to enable type inferrence and autocompletion
 * @param errors - api error definitions
 * @returns the error definitions
 */
declare function makeErrors<ErrorDescription extends ZodiosEndpointError[]>(errors: Narrow<ErrorDescription>): ErrorDescription;
/**
 * Simple helper to split your error definitions into multiple files
 * Mandatory to be used when declaring errors appart from your endpoint definitions
 * to enable type inferrence and autocompletion
 * @param endpoint - api endpoint definition
 * @returns the endpoint definition
 */
declare function makeEndpoint<T extends ZodiosEndpointDefinition<any>>(endpoint: Narrow<T>): T;
declare class Builder<T extends ZodiosEndpointDefinitions> {
    private api;
    constructor(api: T);
    addEndpoint<E extends ZodiosEndpointDefinition>(endpoint: Narrow<E>): Builder<[...T, E]>;
    build(): T;
}
/**
 * Advanced helper to build your api definitions
 * compared to `makeApi()` you'll have better autocompletion experience and better error messages,
 * @param endpoint
 * @returns - a builder to build your api definitions
 */
declare function apiBuilder(): Builder<[]>;
declare function apiBuilder<T extends ZodiosEndpointDefinition<any>>(endpoint: Narrow<T>): Builder<[T]>;
/**
 * Helper to generate a basic CRUD api for a given resource
 * @param resource - the resource to generate the api for
 * @param schema - the schema of the resource
 * @returns - the api definitions
 */
declare function makeCrudApi<T extends string, S extends z.ZodObject<z.ZodRawShape>>(resource: T, schema: S): [{
    method: "get";
    path: `/${T}s`;
    alias: `get${Capitalize<T>}s`;
    description: `Get all ${T}s`;
    response: z.ZodArray<S, "many">;
}, {
    method: "get";
    path: `/${T}s/:id`;
    alias: `get${Capitalize<T>}`;
    description: `Get a ${T}`;
    response: S;
}, {
    method: "post";
    path: `/${T}s`;
    alias: `create${Capitalize<T>}`;
    description: `Create a ${T}`;
    parameters: [{
        name: "body";
        type: "Body";
        description: string;
        schema: z.ZodType<Partial<z.input<S>>, z.ZodTypeDef, Partial<z.input<S>>>;
    }];
    response: S;
}, {
    method: "put";
    path: `/${T}s/:id`;
    alias: `update${Capitalize<T>}`;
    description: `Update a ${T}`;
    parameters: [{
        name: "body";
        type: "Body";
        description: string;
        schema: S;
    }];
    response: S;
}, {
    method: "patch";
    path: `/${T}s/:id`;
    alias: `patch${Capitalize<T>}`;
    description: `Patch a ${T}`;
    parameters: [{
        name: "body";
        type: "Body";
        description: string;
        schema: z.ZodType<Partial<z.input<S>>, z.ZodTypeDef, Partial<z.input<S>>>;
    }];
    response: S;
}, {
    method: "delete";
    path: `/${T}s/:id`;
    alias: `delete${Capitalize<T>}`;
    description: `Delete a ${T}`;
    response: S;
}];
type CleanPath<Path extends string> = Path extends `${infer PClean}/` ? PClean : Path;
type MapApiPath<Path extends string, Api, Acc extends unknown[] = []> = Api extends readonly [infer Head, ...infer Tail] ? MapApiPath<Path, Tail, [
    ...Acc,
    {
        [K in keyof Head]: K extends "path" ? Head[K] extends string ? CleanPath<`${Path}${Head[K]}`> : Head[K] : Head[K];
    }
]> : Acc;
type MergeApis<Apis extends Record<string, ZodiosEndpointDefinition[]>, MergedPathApis = UnionToTuple<{
    [K in keyof Apis]: K extends string ? MapApiPath<K, Apis[K]> : never;
}[keyof Apis]>> = TupleFlat<MergedPathApis>;
/**
 * prefix all paths of an api with a given prefix
 * @param prefix - the prefix to add
 * @param api - the api to prefix
 * @returns the prefixed api
 */
declare function prefixApi<Prefix extends string, Api extends ZodiosEndpointDefinition[]>(prefix: Prefix, api: Api): MapApiPath<Prefix, Api, []>;
/**
 * Merge multiple apis into one in a route friendly way
 * @param apis - the apis to merge
 * @returns the merged api
 *
 * @example
 * ```ts
 * const api = mergeApis({
 *   "/users": usersApi,
 *   "/posts": postsApi,
 * });
 * ```
 */
declare function mergeApis<Apis extends Record<string, ZodiosEndpointDefinition[]>>(apis: Apis): MergeApis<Apis>;

export { ApiOf, PluginId, Zodios, ZodiosClass, ZodiosConstructor, ZodiosError, ZodiosInstance, apiBuilder, checkApi, formDataPlugin, formURLPlugin, headerPlugin, isErrorFromAlias, isErrorFromPath, makeApi, makeCrudApi, makeEndpoint, makeErrors, makeParameters, mergeApis, parametersBuilder, prefixApi, zodValidationPlugin };
