export type ActionMetrics = {
    success?: number
    error?: number
}

export type ClientActions = {
    created?: ActionMetrics
    updated?: ActionMetrics
    fetched?: ActionMetrics
}

export type SyncStatus = {
    success?: number
    error?: number
}

type Metrics<T> = {
    [name: string]: Record<string, T>
}

export type SyncMetrics = Metrics<SyncStatus>
export type ClientMetrics = Metrics<ClientActions>
