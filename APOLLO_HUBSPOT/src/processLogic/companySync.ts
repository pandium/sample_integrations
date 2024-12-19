import HubSpot from '../hubspot/index.js'
import Apollo from '../apollo/index.js'
import Metrics from '../libs/metrics/metrics.js'
import { Context, Config, isTruthy } from '../libs/lib.js'

import { namespaceLogger } from '../libs/logger.js'
import NextContext from '../libs/nextContext/nextContext.js'
import { hsCompaniesToApEnrichmentRequest } from '../hubspot/transformations.js'
import { enrichedApOrganizationsToUpdatedHsCompany } from '../apollo/transformations.js'
import { Company, CompanyInput } from '../hubspot/models.js'
import { exitHandler } from '../index.js'
const logger = namespaceLogger('Company Sync')

export const companySync = async (
    hsClient: HubSpot,
    apClient: Apollo,
    thisContext: Context,
    metrics: Metrics,
    nextContext: NextContext,
    config: Config
) => {
    logger.info(
        '----------------------- STARTING COMPANY SYNC -----------------------'
    )
    const lastRunStdOut = JSON.parse(
        thisContext.last_successful_run_std_out || '{}'
    )
    const firstPageForThisSync = lastRunStdOut?.page || ''
    nextContext.updateResourceContext('companies', 'page', firstPageForThisSync)
    logger.info(
        `This run will fetch HubSpot companies starting with ${
            firstPageForThisSync
                ? `page cursor ${firstPageForThisSync} because that is where the last run left off`
                : 'the first page'
        }.`
    )

    // If this sync starting with the first page of HubSpot Companies (i.e. hubSpot page is undefined),
    // then the lastStartDate should be reset to now.
    const now = new Date().toISOString()
    const lastStartDate = firstPageForThisSync
        ? lastRunStdOut?.lastStartDate || now
        : now
    nextContext.updateResourceContext(
        'companies',
        'lastStartDate',
        lastStartDate
    )
    logger.info(
        `This run will process HubSpot companies that have not been updated since ${nextContext.resources['companies'].lastStartDate}.`
    )

    const companyParams: Record<string, any> = {
        limit: config.hubspot_records_per_page,
        properties: 'apollo_enriched_date,domain,name',
    }
    if (firstPageForThisSync) {
        companyParams.after = firstPageForThisSync
    }
    let companyBatch: Company[] = []
    const getHsCompanies = hsClient.generateCompanies(companyParams)

    let next
    while (!(next = await getHsCompanies.next()).done) {
        const hsCompany = next.value

        const companyEnrichedDate = hsCompany.properties.apollo_enriched_date
        if (companyEnrichedDate && companyEnrichedDate > lastStartDate) {
            logger.debug(
                `Will not get Apollo.io Enriched information for the Hubspot Company ${hsCompany.id}: ${hsCompany.properties.name} because it was enriched on ${companyEnrichedDate} which is after ${lastStartDate}`
            )
            continue
        }

        if (!hsCompany.properties.domain) {
            logger.warn(
                `Cannot get Apollo.io Enriched information for the Hubspot Company ${hsCompany.id}: ${hsCompany.properties.name} because it has no domain in Hubspot`
            )
            metrics.incrementSyncMetrics('companySync', 'companies', 'error')
            continue
        }

        companyBatch.push(hsCompany)
        if (companyBatch.length === 10) {
            await processCompanyBatch(
                apClient,
                hsClient,
                companyBatch,
                nextContext,
                metrics /*,
                config*/
            )
            companyBatch = []
        }
    }

    if (companyBatch.length) {
        await processCompanyBatch(
            apClient,
            hsClient,
            companyBatch,
            nextContext,
            metrics /*,
            config*/
        )
    }

    // Set the context's page number to be empty so the next run starts over with the first page.
    nextContext.updateResourceContext('companies', 'page', '')

    logger.info(
        '----------------------- COMPANY SYNC COMPLETED -----------------------'
    )
}

const processCompanyBatch = async (
    apClient: Apollo,
    hsClient: HubSpot,
    companyBatch: Company[],
    nextContext: NextContext,
    metrics: Metrics /*,
    config: Config*/
) => {
    logger.debug(
        `Processing a batch of HubSpot companies: ${companiesForLogs(
            companyBatch
        )}`
    )

    // For QA purposes
    // if (
    //     isTruthy(config.simulate_timeout) &&
    //     nextContext.resources['companies'].page
    // ) {
    //     exitHandler(true, 0, metrics, nextContext)
    // }

    // Get enriched organizations from Apollo.io
    const apolloEnrichmentRequest = hsCompaniesToApEnrichmentRequest(
        companyBatch
    )
    const enrichedOrganizations = await apClient.bulkEnrichOrganizations(
        apolloEnrichmentRequest
    )

    if (!enrichedOrganizations) {
        logger.error(
            `Cannot update these HubSpot Companies without enriched organization information from Apollo.io: ${companiesForLogs(
                companyBatch
            )}`
        )
        metrics.incrementSyncMetrics(
            'companySync',
            'companies',
            'error',
            companyBatch.length
        )
        return
    }

    // Make hubspot batch update payload for the batch of 10 companies.
    const updatedHsCompanies: CompanyInput[] = []
    for (const hsCompany of companyBatch) {
        try {
            const updatedHsCompany = enrichedApOrganizationsToUpdatedHsCompany(
                enrichedOrganizations,
                hsCompany
            )
            updatedHsCompanies.push(updatedHsCompany)
            metrics.incrementSyncMetrics('companySync', 'companies', 'success')
        } catch (error) {
            logger.error(
                `Error making HubSpot company update payload: ${error}`
            )
            metrics.incrementSyncMetrics('companySync', 'companies', 'error')
        }
    }

    // Send the batch update to hubspot
    if (updatedHsCompanies.length) {
        logger.debug(
            `Updating HubSpot Companies: ${companiesForLogs(
                updatedHsCompanies
            )}`
        )
        await hsClient.updateCompanies({ inputs: updatedHsCompanies })
    }

    // Update context with the page number of the last company in the batch
    const newPage = companyBatch.pop()!.page!
    nextContext.updateResourceContext('companies', 'page', newPage)
}

const companiesForLogs = (companies: Company[] | CompanyInput[]) =>
    companies
        .map((company) =>
            company.properties.name
                ? `ID ${company.id}:${company.properties.name}`
                : `ID ${company.id}`
        )
        .join(', ')
