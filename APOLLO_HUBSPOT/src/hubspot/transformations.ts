import { Company } from './models.js'
import { BulkOrganizationEnrichmentRequest } from '../apollo/models'
import { namespaceLogger } from '../libs/logger.js'
const logger = namespaceLogger('Company Sync')

export const hsCompaniesToApEnrichmentRequest = (
    hsCompanies: Company[]
): BulkOrganizationEnrichmentRequest => {
    const domains = hsCompanies.map((company) => company.properties.domain!)

    return {
        domains: domains as string[],
    }
}
