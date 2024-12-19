import HubSpot from '../hubspot/index.js'
import Metrics from '../libs/metrics/metrics.js'
import { CreateProperty } from '../hubspot/models.js'

import { namespaceLogger } from '../libs/logger.js'
const logger = namespaceLogger('Init Sync')

export const CUSTOM_DATE_PROPERTY = 'apollo_enriched_date'
const CUSTOM_COMPANY_SIZE_PROPERTY = 'company_size'

export const initSync = async (hsClient: HubSpot, metrics: Metrics) => {
    logger.info(
        '----------------------- STARTING INIT SYNC -----------------------'
    )

    const companyProperties = await hsClient.getCompanyProperties({
        properties: 'name',
    })

    if (!companyProperties) {
        throw new Error(
            `Unable to check if ${CUSTOM_DATE_PROPERTY} property exists on HubSpot companies.`
        )
    }

    const customDateProperty = companyProperties.find(
        (property) => property.name === CUSTOM_DATE_PROPERTY
    )

    if (!customDateProperty) {
        const customDatePropertyPayload: CreateProperty = {
            hidden: true,
            label: 'Date Last Enriched via Apollo',
            type: 'datetime',
            formField: false,
            groupName: 'companyinformation',
            name: CUSTOM_DATE_PROPERTY,
            hasUniqueValue: false,
            fieldType: 'date',
            externalOptions: false,
        }

        const newCustomDateProperty = await hsClient.createCompanyProperty(
            customDatePropertyPayload
        )

        if (!newCustomDateProperty) {
            throw new Error(
                `${CUSTOM_DATE_PROPERTY} does not exist and cannot be created.`
            )
        }
    } else {
        logger.info(
            `${CUSTOM_DATE_PROPERTY} is already a company property in HubSpot.  No need to create it.`
        )
    }

    const customSizeProperty = companyProperties.find(
        (property) => property.name === CUSTOM_COMPANY_SIZE_PROPERTY
    )

    if (!customSizeProperty) {
        const customSizePropertyPayload: CreateProperty = {
            hidden: false,
            label: 'Company Size',
            type: 'enumeration',
            formField: false,
            groupName: 'companyinformation',
            name: CUSTOM_COMPANY_SIZE_PROPERTY,
            hasUniqueValue: false,
            fieldType: 'select',
            options: [
                {
                    label: 'Less than 50',
                    value: 'Less than 50',
                    displayOrder: 0,
                    hidden: false,
                },
                {
                    label: '51-100',
                    value: '50-100',
                    displayOrder: 1,
                    hidden: false,
                },
                {
                    label: '101-500',
                    value: '100-500',
                    displayOrder: 2,
                    hidden: false,
                },
                {
                    label: '501-5,000',
                    value: '500+',
                    displayOrder: 3,
                    hidden: false,
                },
                {
                    label: '5,001+',
                    value: '5,001+',
                    displayOrder: 4,
                    hidden: false,
                },
            ],
            externalOptions: false,
        }

        const newCustomSizeProperty = await hsClient.createCompanyProperty(
            customSizePropertyPayload
        )

        if (!newCustomSizeProperty) {
            throw new Error(
                `${CUSTOM_COMPANY_SIZE_PROPERTY} does not exist and cannot be created.`
            )
        }
    } else {
        logger.info(
            `${CUSTOM_COMPANY_SIZE_PROPERTY} is already a company property in HubSpot.  No need to create it.`
        )
    }

    logger.info(
        '-----------------------  INIT SYNC COMPLETED -----------------------'
    )
}
