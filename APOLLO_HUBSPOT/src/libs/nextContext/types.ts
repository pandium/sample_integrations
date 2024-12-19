export type ContextResourceProperties = {
    page?: string
    lastStartDate?: string
}

export type ContextResources = {
    [resource: string]: ContextResourceProperties
}
