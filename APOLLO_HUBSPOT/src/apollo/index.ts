import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import {
    BulkOrganizationEnrichmentRequest,
    BulkEnrichmentResponse,
    Organization,
} from './models.js'

import { exitHandler } from '../index.js'
import Metrics from '../libs/metrics/metrics.js'
import { namespaceLogger } from '../libs/logger.js'
import NextContext from '../libs/nextContext/nextContext.js'
const logger = namespaceLogger('Apollo')

export default class Client {
    _axiosInstance: AxiosInstance
    _errorCount = 0
    metrics: Metrics
    context: NextContext

    bulkEnrichOrganizations: (
        payload: BulkOrganizationEnrichmentRequest
    ) => Promise<Organization[]>

    constructor(apiKey: string, metrics: Metrics, nextContext: NextContext) {
        const headers = {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json',
        }

        this._axiosInstance = axios.create({
            baseURL: 'https://api.apollo.io/api/v1/',
            headers: headers,
        })

        this.metrics = metrics
        this.context = nextContext

        this._axiosInstance.interceptors.response.use(
            (resp) => {
                this._errorCount = 0
                return resp
            },
            (error) => {
                this._errorCount++
                if (axios.isAxiosError(error)) {
                    // Kill the sync if we have an 401
                    if (error.response?.status === 401) {
                        logger.error(
                            '❌ Apollo.io Auth error. Stopping execution'
                        )
                        exitHandler(false, 1, this.metrics, this.context)
                    }

                    if (this._errorCount > 10) {
                        logger.error(
                            '❌ Potential runaway error. Stopping execution'
                        )
                        exitHandler(false, 5, this.metrics, this.context)
                    }

                    if (error.response?.status == 429) {
                        const headers = error.response.headers

                        const dailyLimit = headers['x-rate-limit-24-hour']
                        if (headers['x-hourly-usage'] === dailyLimit) {
                            logger.error(
                                `❌ Daily ${dailyLimit} Limit of Apollo requests reached.  Stopping execution because this integration cannot accomplish more work today.`
                            )
                            exitHandler(false, 0, this.metrics, this.context)
                        }

                        const hourlyLimit = headers['x-rate-limit-hourly']
                        if (headers['x-hourly-usage'] === hourlyLimit) {
                            logger.error(
                                `❌ Hourly ${hourlyLimit} Limit of Apollo requests reached.  Stopping execution because this integration cannot accomplish more work this hour.`
                            )
                            exitHandler(false, 0, this.metrics, this.context)
                        }
                    }
                }

                return Promise.reject(error)
            }
        )

        axiosRetry(this._axiosInstance, {
            retries: 6,
            retryDelay: (retryCount) => 30000, //This wait is so long because the most likely Apollo error is that more than 20 requests were made in a minute.
            onRetry: (retryCount) => {
                logger.warn(
                    `Apollo.io retry attempted. Attempt number ${retryCount}`
                )
            },
            retryCondition: (error) => {
                // Check for reaching limit of requests per minute
                const requestsAllowedPerMin =
                    error.response?.headers['x-rate-limit-minute']
                if (
                    error.response?.headers['x-minute-usage'] ===
                    requestsAllowedPerMin
                ) {
                    logger.error(
                        `❌ ${requestsAllowedPerMin} requests per minute Limit of Apollo requests reached.  Pausing execution for 30 seconds.`
                    )
                    return true
                }

                // Check if the error is a network error
                if (!error.response) {
                    return true
                }
                // Check if the response status is a 5xx server error
                return (
                    error.response.status >= 500 && error.response.status <= 599
                )
            },
        })

        this.bulkEnrichOrganizations = this.createBulkEnrich('organizations')
    }

    createBulkEnrich<EnrichedResource, EnrichmentRequest>(
        resource: string
    ): (payload: EnrichmentRequest) => Promise<EnrichedResource> {
        return async (payload) => {
            try {
                logger.debug(`Getting enriched ${resource} from Apollo.io`)
                const url = `${resource}/bulk_enrich`
                const { data } = await this._axiosInstance.post<
                    BulkEnrichmentResponse
                >(url, payload)

                this.metrics.incrementClientMetrics(
                    'apollo',
                    resource,
                    'fetched',
                    'success',
                    data.unique_enriched_records
                )
                return (data as any)[resource]
            } catch (error) {
                logger.error(
                    `❌ There was an error while attempting to get enriched ${resource} from Apollo.io : ${error}`
                )
                this.metrics.incrementClientMetrics(
                    'apollo',
                    resource,
                    'fetched',
                    'error',
                    (payload as any).domains.length
                )
                return
            }
        }
    }
}
