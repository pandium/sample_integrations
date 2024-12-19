import { Organization } from './models.js'
import {
    Company,
    CompanyInput,
    UpdateCompanyProperties,
    HubSpotIndustry,
    CompanySize,
} from '../hubspot/models.js'

export const enrichedApOrganizationsToUpdatedHsCompany = (
    enrichedApOrganizations: Organization[],
    hsCompany: Company
): CompanyInput => {
    const enrichedOrganization = enrichedApOrganizations.find(
        (organization) =>
            organization?.primary_domain === hsCompany.properties.domain
    )

    if (!enrichedOrganization) {
        throw new Error(
            `Apollo.io could not provide Enriched information for the HubSpot company ${hsCompany.id}: ${hsCompany.properties.name}`
        )
    }

    const updatedProperties: UpdateCompanyProperties = {
        apollo_enriched_date: new Date().toISOString(),
    }

    if (enrichedOrganization.estimated_num_employees) {
        updatedProperties.company_size = getHsCompanySize(
            enrichedOrganization.estimated_num_employees
        )
    }

    if (
        enrichedOrganization.industry?.toLocaleLowerCase() in
        apToHsIndustryMapper
    ) {
        updatedProperties.industry =
            apToHsIndustryMapper[enrichedOrganization.industry.toLowerCase()]
    }

    if (enrichedOrganization.city) {
        updatedProperties.city = enrichedOrganization.city
    }

    if (enrichedOrganization.state) {
        updatedProperties.state = enrichedOrganization.state
    }

    if (enrichedOrganization.country) {
        updatedProperties.country = enrichedOrganization.country
    }

    return {
        id: hsCompany.id,
        properties: updatedProperties,
    }
}

const getHsCompanySize = (apEmployeeEstimate: number): CompanySize => {
    switch (true) {
        case apEmployeeEstimate < 50:
            return CompanySize.LESS_THAN_FIFTY
        case apEmployeeEstimate <= 100:
            return CompanySize.FIFTY_TO_HUNDRED
        case apEmployeeEstimate <= 500:
            return CompanySize.HUNDRED_TO_FIVE_HUNDRED
        case apEmployeeEstimate <= 5000:
            return CompanySize.FIVE_HUNDRED_TO_FIVE_THOUSAND
        default:
            return CompanySize.MORE_THAN_FIVE_THOUSAND
    }
}

// https://knowledge.apollo.io/hc/en-us/articles/4409230850189-Industry-Filter-Options
const apToHsIndustryMapper: {
    [apolloIndustry: string]: HubSpotIndustry
} = {
    accounting: HubSpotIndustry.ACCOUNTING,
    agriculture: HubSpotIndustry.FARMING,
    'airlines/aviation': HubSpotIndustry.AIRLINES_AVIATION,
    'alternative dispute resolution':
        HubSpotIndustry.ALTERNATIVE_DISPUTE_RESOLUTION,
    'alternative medicine': HubSpotIndustry.ALTERNATIVE_MEDICINE,
    animation: HubSpotIndustry.ANIMATION,
    'apparel & fashion': HubSpotIndustry.APPAREL_FASHION,
    'architecture & planning': HubSpotIndustry.ARCHITECTURE_PLANNING,
    'arts and crafts': HubSpotIndustry.ARTS_AND_CRAFTS,
    automotive: HubSpotIndustry.AUTOMOTIVE,
    'aviation & aerospace': HubSpotIndustry.AVIATION_AEROSPACE,
    banking: HubSpotIndustry.BANKING,
    biotechnology: HubSpotIndustry.BIOTECHNOLOGY,
    'broadcast media': HubSpotIndustry.BROADCAST_MEDIA,
    'building materials': HubSpotIndustry.BUILDING_MATERIALS,
    'business supplies & equipment':
        HubSpotIndustry.BUSINESS_SUPPLIES_AND_EQUIPMENT,
    'capital markets': HubSpotIndustry.CAPITAL_MARKETS,
    chemicals: HubSpotIndustry.CHEMICALS,
    'civic & social organization': HubSpotIndustry.CIVIC_SOCIAL_ORGANIZATION,
    'civil engineering': HubSpotIndustry.CIVIL_ENGINEERING,
    'commercial real estate': HubSpotIndustry.COMMERCIAL_REAL_ESTATE,
    'computer & network security': HubSpotIndustry.COMPUTER_NETWORK_SECURITY,
    'computer games': HubSpotIndustry.COMPUTER_GAMES,
    'computer hardware': HubSpotIndustry.COMPUTER_HARDWARE,
    'computer networking': HubSpotIndustry.COMPUTER_NETWORKING,
    'computer software': HubSpotIndustry.COMPUTER_SOFTWARE,
    construction: HubSpotIndustry.CONSTRUCTION,
    'consumer electronics': HubSpotIndustry.CONSUMER_ELECTRONICS,
    'consumer goods': HubSpotIndustry.CONSUMER_GOODS,
    'consumer services': HubSpotIndustry.CONSUMER_SERVICES,
    cosmetics: HubSpotIndustry.COSMETICS,
    dairy: HubSpotIndustry.DAIRY,
    'defense & space': HubSpotIndustry.DEFENSE_SPACE,
    design: HubSpotIndustry.DESIGN,
    'education management': HubSpotIndustry.EDUCATION_MANAGEMENT,
    'e-learning': HubSpotIndustry.E_LEARNING,
    'electrical/electronic manufacturing':
        HubSpotIndustry.ELECTRICAL_ELECTRONIC_MANUFACTURING,
    entertainment: HubSpotIndustry.ENTERTAINMENT,
    'environmental services': HubSpotIndustry.ENVIRONMENTAL_SERVICES,
    'events services': HubSpotIndustry.EVENTS_SERVICES,
    'executive office': HubSpotIndustry.EXECUTIVE_OFFICE,
    'facilities services': HubSpotIndustry.FACILITIES_SERVICES,
    farming: HubSpotIndustry.FARMING,
    'financial services': HubSpotIndustry.FINANCIAL_SERVICES,
    'fine art': HubSpotIndustry.FINE_ART,
    fishery: HubSpotIndustry.FISHERY,
    'food & beverages': HubSpotIndustry.FOOD_BEVERAGES,
    'food production': HubSpotIndustry.FOOD_PRODUCTION,
    'fund-raising': HubSpotIndustry.FUND_RAISING,
    furniture: HubSpotIndustry.FURNITURE,
    'gambling & casinos': HubSpotIndustry.GAMBLING_CASINOS,
    'glass, ceramics & concrete': HubSpotIndustry.GLASS_CERAMICS_CONCRETE,
    'government administration': HubSpotIndustry.GOVERNMENT_ADMINISTRATION,
    'government relations': HubSpotIndustry.GOVERNMENT_RELATIONS,
    'graphic design': HubSpotIndustry.GRAPHIC_DESIGN,
    'health, wellness & fitness': HubSpotIndustry.HEALTH_WELLNESS_AND_FITNESS,
    'higher education': HubSpotIndustry.HIGHER_EDUCATION,
    'hospital & health care': HubSpotIndustry.HOSPITAL_HEALTH_CARE,
    hospitality: HubSpotIndustry.HOSPITALITY,
    'human resources': HubSpotIndustry.HUMAN_RESOURCES,
    'import & export': HubSpotIndustry.IMPORT_AND_EXPORT,
    'individual & family services': HubSpotIndustry.INDIVIDUAL_FAMILY_SERVICES,
    'industrial automation': HubSpotIndustry.INDUSTRIAL_AUTOMATION,
    'information services': HubSpotIndustry.INFORMATION_SERVICES,
    'information technology & services':
        HubSpotIndustry.INFORMATION_TECHNOLOGY_AND_SERVICES,
    insurance: HubSpotIndustry.INSURANCE,
    'international affairs': HubSpotIndustry.INTERNATIONAL_AFFAIRS,
    'international trade & development':
        HubSpotIndustry.INTERNATIONAL_TRADE_AND_DEVELOPMENT,
    internet: HubSpotIndustry.INTERNET,
    'investment banking': HubSpotIndustry.INVESTMENT_BANKING,
    'investment management': HubSpotIndustry.INVESTMENT_MANAGEMENT,
    judiciary: HubSpotIndustry.JUDICIARY,
    'law enforcement': HubSpotIndustry.LAW_ENFORCEMENT,
    'law practice': HubSpotIndustry.LAW_PRACTICE,
    'legal services': HubSpotIndustry.LEGAL_SERVICES,
    'legislative office': HubSpotIndustry.LEGISLATIVE_OFFICE,
    'leisure, travel & tourism': HubSpotIndustry.LEISURE_TRAVEL_TOURISM,
    libraries: HubSpotIndustry.LIBRARIES,
    'logistics & supply chain': HubSpotIndustry.LOGISTICS_AND_SUPPLY_CHAIN,
    'luxury goods & jewelry': HubSpotIndustry.LUXURY_GOODS_JEWELRY,
    machinery: HubSpotIndustry.MACHINERY,
    'management consulting': HubSpotIndustry.MANAGEMENT_CONSULTING,
    maritime: HubSpotIndustry.MARITIME,
    'market research': HubSpotIndustry.MARKET_RESEARCH,
    'marketing & advertising': HubSpotIndustry.MARKETING_AND_ADVERTISING,
    'mechanical or industrial engineering':
        HubSpotIndustry.MECHANICAL_OR_INDUSTRIAL_ENGINEERING,
    'media production': HubSpotIndustry.MEDIA_PRODUCTION,
    'medical devices': HubSpotIndustry.MEDICAL_DEVICES,
    'medical practice': HubSpotIndustry.MEDICAL_PRACTICE,
    'mental health care': HubSpotIndustry.MENTAL_HEALTH_CARE,
    military: HubSpotIndustry.MILITARY,
    'mining & metals': HubSpotIndustry.MINING_METALS,
    'motion pictures & film': HubSpotIndustry.MOTION_PICTURES_AND_FILM,
    'museums & institutions': HubSpotIndustry.MUSEUMS_AND_INSTITUTIONS,
    music: HubSpotIndustry.MUSIC,
    nanotechnology: HubSpotIndustry.NANOTECHNOLOGY,
    newspapers: HubSpotIndustry.NEWSPAPERS,
    'non-profit organization management':
        HubSpotIndustry.NON_PROFIT_ORGANIZATION_MANAGEMENT,
    'oil & energy': HubSpotIndustry.OIL_ENERGY,
    'online media': HubSpotIndustry.ONLINE_MEDIA,
    'outsourcing/offshoring': HubSpotIndustry.OUTSOURCING_OFFSHORING,
    'package/freight delivery': HubSpotIndustry.PACKAGE_FREIGHT_DELIVERY,
    'packaging & containers': HubSpotIndustry.PACKAGING_AND_CONTAINERS,
    'paper & forest products': HubSpotIndustry.PAPER_FOREST_PRODUCTS,
    'performing arts': HubSpotIndustry.PERFORMING_ARTS,
    pharmaceuticals: HubSpotIndustry.PHARMACEUTICALS,
    philanthropy: HubSpotIndustry.PHILANTHROPY,
    photography: HubSpotIndustry.PHOTOGRAPHY,
    plastics: HubSpotIndustry.PLASTICS,
    'political organization': HubSpotIndustry.POLITICAL_ORGANIZATION,
    'primary/secondary education': HubSpotIndustry.PRIMARY_SECONDARY_EDUCATION,
    printing: HubSpotIndustry.PRINTING,
    'professional training & coaching':
        HubSpotIndustry.PROFESSIONAL_TRAINING_COACHING,
    'program development': HubSpotIndustry.PROGRAM_DEVELOPMENT,
    'public policy': HubSpotIndustry.PUBLIC_POLICY,
    'public relations & communications':
        HubSpotIndustry.PUBLIC_RELATIONS_AND_COMMUNICATIONS,
    'public safety': HubSpotIndustry.PUBLIC_SAFETY,
    publishing: HubSpotIndustry.PUBLISHING,
    'railroad manufacture': HubSpotIndustry.RAILROAD_MANUFACTURE,
    ranching: HubSpotIndustry.RANCHING,
    'real estate': HubSpotIndustry.REAL_ESTATE,
    'recreational facilities & services':
        HubSpotIndustry.RECREATIONAL_FACILITIES_AND_SERVICES,
    'religious institutions': HubSpotIndustry.RELIGIOUS_INSTITUTIONS,
    'renewables & environment': HubSpotIndustry.RENEWABLES_ENVIRONMENT,
    research: HubSpotIndustry.RESEARCH,
    restaurants: HubSpotIndustry.RESTAURANTS,
    retail: HubSpotIndustry.RETAIL,
    'security & investigations': HubSpotIndustry.SECURITY_AND_INVESTIGATIONS,
    semiconductors: HubSpotIndustry.SEMICONDUCTORS,
    shipbuilding: HubSpotIndustry.SHIPBUILDING,
    'sporting goods': HubSpotIndustry.SPORTING_GOODS,
    sports: HubSpotIndustry.SPORTS,
    'staffing & recruiting': HubSpotIndustry.STAFFING_AND_RECRUITING,
    supermarkets: HubSpotIndustry.SUPERMARKETS,
    telecommunications: HubSpotIndustry.TELECOMMUNICATIONS,
    textiles: HubSpotIndustry.TEXTILES,
    'think tanks': HubSpotIndustry.THINK_TANKS,
    tobacco: HubSpotIndustry.TOBACCO,
    'translation & localization': HubSpotIndustry.TRANSLATION_AND_LOCALIZATION,
    'transportation/trucking/railroad':
        HubSpotIndustry.TRANSPORTATION_TRUCKING_RAILROAD,
    utilities: HubSpotIndustry.UTILITIES,
    'venture capital & private equity':
        HubSpotIndustry.VENTURE_CAPITAL_PRIVATE_EQUITY,
    veterinary: HubSpotIndustry.VETERINARY,
    warehousing: HubSpotIndustry.WAREHOUSING,
    wholesale: HubSpotIndustry.WHOLESALE,
    'wine & spirits': HubSpotIndustry.WINE_AND_SPIRITS,
    wireless: HubSpotIndustry.WIRELESS,
    'writing & editing': HubSpotIndustry.WRITING_AND_EDITING,
}
