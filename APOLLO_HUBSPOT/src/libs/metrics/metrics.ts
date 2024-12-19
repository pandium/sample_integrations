import { Logger } from 'winston'
import {
    ClientMetrics,
    SyncMetrics,
    ActionMetrics,
    SyncStatus,
    ClientActions,
} from './types'

export default class Metrics {
    clientMetrics: ClientMetrics = {}
    syncMetrics: SyncMetrics = {}

    incrementSyncMetrics = (
        name: string,
        resource: string,
        status: keyof SyncStatus,
        amount?: number
    ) => {
        if (!this.syncMetrics[name]) {
            this.syncMetrics[name] = {}
        }
        if (!this.syncMetrics[name][resource]) {
            this.syncMetrics[name][resource] = {} as SyncStatus
        }
        this.syncMetrics[name][resource]![status] =
            (this.syncMetrics[name][resource]![status] ?? 0) + (amount ?? 1)
    }

    incrementClientMetrics = (
        client: string,
        resource: string,
        action: keyof ClientActions,
        status: keyof ActionMetrics,
        amount?: number
    ) => {
        if (!this.clientMetrics[client]) {
            this.clientMetrics[client] = {}
        }
        if (!this.clientMetrics[client][resource]) {
            this.clientMetrics[client][resource] = {} as ClientActions
        }
        if (!this.clientMetrics[client][resource][action]) {
            this.clientMetrics[client][resource][action] = {} as ActionMetrics
        }
        this.clientMetrics[client][resource][action]![status] =
            (this.clientMetrics[client][resource][action]![status] ?? 0) +
            (amount ?? 1)
    }

    printMetrics = (logger: Logger) => {
        for (const [sync, v1] of Object.entries(this.syncMetrics)) {
            for (const [resource, v2] of Object.entries(v1)) {
                for (const [result, num] of Object.entries(v2)) {
                    logger.info(
                        `[${sync} sync] ${resource} with status ${result}: ${num}`
                    )
                }
            }
        }

        for (const [client, v1] of Object.entries(this.clientMetrics)) {
            for (const [resource, v2] of Object.entries(v1)) {
                for (const [action, results] of Object.entries(v2)) {
                    for (const [result, num] of Object.entries(results)) {
                        logger.info(
                            `[${client} client] ${resource} ${action} with status ${result}: ${num}`
                        )
                    }
                }
            }
        }
    }
}
