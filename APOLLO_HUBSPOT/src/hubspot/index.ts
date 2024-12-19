import axios, { AxiosInstance } from 'axios'

import {
    HubSpotGetResponse,
    Company,
    Property,
    CreateProperty,
    BulkCompanyUpdateResponse,
    BulkCompanyUpdateRequest,
} from './models.js'

import { exitHandler } from '../index.js'
import Metrics from '../libs/metrics/metrics.js'
import { namespaceLogger } from '../libs/logger.js'
import NextContext from '../libs/nextContext/nextContext.js'
const logger = namespaceLogger('HubSpot')

export default class Client {
    _axiosInstance: AxiosInstance
    _errorCount = 0
    metrics: Metrics
    context: NextContext

    getCompanyProperties: (
        params: Record<string, any>
    ) => Promise<Property[] | undefined>
    createCompanyProperty: (
        payload: CreateProperty
    ) => Promise<Property | undefined>
    updateCompanies: (
        request: BulkCompanyUpdateRequest
    ) => Promise<Company[] | undefined>

    constructor(
        accessToken: string,
        metrics: Metrics,
        nextContext: NextContext
    ) {
        const authString = 'Bearer ' + accessToken
        const headers = {
            Authorization: authString,
            accept: 'application/json',
        }

        this._axiosInstance = axios.create({
            baseURL: 'https://api.hubapi.com/crm/v3/',
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
                            '❌ HubSpot Auth error. Stopping execution'
                        )
                        exitHandler(false, 1, this.metrics, this.context)
                    }

                    if (this._errorCount > 10) {
                        logger.error(
                            '❌ Potential runaway error. Stopping execution'
                        )
                        exitHandler(false, 5, this.metrics, this.context)
                    }
                }

                return Promise.reject(error)
            }
        )

        this.getCompanyProperties = this.createGetResource(
            'company_properties',
            'properties/companies'
        )
        this.createCompanyProperty = this.createPostResource(
            'company_properties',
            'properties/companies'
        )
        this.updateCompanies = this.createBulkResourceUpdate(
            'companies',
            'objects/companies/batch/update'
        )
    }
    // For resources that do not require pagination
    createGetResource<Resource>(
        resource: string,
        url: string
    ): (params: Record<string, any>) => Promise<Resource[] | undefined> {
        return async (params) => {
            let resources: Resource[] = []
            try {
                logger.debug(`Fetching ${resource} records from HubSpot`)
                const { data } = await this._axiosInstance.get<
                    HubSpotGetResponse
                >(url, { params })
                resources = data.results as Resource[]
                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resource,
                    'fetched',
                    'success',
                    data.results.length
                )
            } catch (error) {
                logger.error(
                    `❌ There was an error while attempting to fetch ${resource} from HubSpot: ${error}.`
                )
                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resource,
                    'fetched',
                    'error'
                )
                return undefined
            }
            return resources
        }
    }

    // For paged resources.
    async *generateResources<Resource>(
        resource: string,
        url: string,
        params: Record<string, any>
    ) {
        while (true) {
            try {
                logger.debug(
                    `Fetching HubSpot ${resource} records from ${
                        params.after
                            ? `page cursor: ${params.after}`
                            : 'the first page'
                    }.`
                )
                const { data } = await this._axiosInstance.get<
                    HubSpotGetResponse
                >(url, { params })

                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resource,
                    'fetched',
                    'success',
                    data.results.length
                )

                for (const result of data.results) {
                    result.page = params.after
                    yield result as Resource
                }

                if (!data.paging?.next?.after) break
                params.after = data.paging.next.after
            } catch (error) {
                logger.error(
                    `❌ There was an error while attempting to fetch ${resource} for cursor ${this.context.resources[resource].page} from HubSpot: ${error}.`
                )
                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resource,
                    'fetched',
                    'error'
                )
                break
            }
        }

        return
    }

    generateCompanies = (params: Record<string, any>) =>
        this.generateResources<Company>(
            'companies',
            'objects/companies',
            params
        )

    createPostResource<ResourcePayload, CreatedResource>(
        resourceName: string,
        url: string
    ): (
        resoucePayload: ResourcePayload
    ) => Promise<CreatedResource | undefined> {
        return async (resoucePayload) => {
            try {
                const { data } = await this._axiosInstance.post<
                    CreatedResource
                >(url, resoucePayload)
                logger.debug(`✅ Created ${resourceName} in HubSpot`)

                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resourceName,
                    'created',
                    'success',
                    1
                )
                return data
            } catch (error) {
                logger.error(
                    `❌ There was an error while attempting to create a ${resourceName} in HubSpot: ${error}`
                )
                logger.error(JSON.stringify(resoucePayload))
                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resourceName,
                    'created',
                    'error'
                )
                return
            }
        }
    }

    createBulkResourceUpdate<BulkUpdateRequest, UpdatedResource>(
        resourceName: string,
        url: string
    ): (
        updateRequest: BulkUpdateRequest
    ) => Promise<UpdatedResource | undefined> {
        return async (updateRequest) => {
            try {
                const { data } = await this._axiosInstance.post<
                    BulkCompanyUpdateResponse
                >(url, updateRequest)
                logger.debug(
                    `✅ Updated ${resourceName} successfully in HubSpot.`
                )

                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resourceName,
                    'updated',
                    'success',
                    data.results.length
                )
                return data.results as UpdatedResource
            } catch (error) {
                logger.error(
                    `❌ There was an error while attempting to update ${resourceName} in HubSpot: ${error}`
                )
                logger.error(JSON.stringify(updateRequest))
                this.metrics.incrementClientMetrics(
                    'hubspot',
                    resourceName,
                    'updated',
                    'error'
                )
                return
            }
        }
    }
}
