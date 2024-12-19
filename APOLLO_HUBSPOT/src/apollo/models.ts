export interface BulkOrganizationEnrichmentRequest {
    domains: string[]
}

export interface BulkEnrichmentResponse {
    status: string
    error_code: any
    error_message: any
    total_requested_domains: number
    unique_domains: number
    unique_enriched_records: number
    missing_records: number
    organizations: Organization[]
}

export interface Organization {
    id: string
    name: string
    website_url: string
    blog_url: any
    angellist_url: any
    linkedin_url: string
    twitter_url: string
    facebook_url: string
    primary_phone: PrimaryPhone
    languages: string[]
    alexa_ranking: number
    phone: string
    linkedin_uid: string
    founded_year: number
    publicly_traded_symbol?: string
    publicly_traded_exchange?: string
    logo_url: string
    crunchbase_url: any
    primary_domain: string
    sanitized_phone: string
    industry: string
    keywords: string[]
    estimated_num_employees: number
    industries: string[]
    secondary_industries: string[]
    snippets_loaded: boolean
    industry_tag_id: string
    industry_tag_hash: IndustryTagHash
    retail_location_count: number
    raw_address: string
    street_address: string
    city: string
    state: string
    country: string
    postal_code: string
    owned_by_organization_id: any
    account_id?: string
    account?: Account
    departmental_head_count: DepartmentalHeadCount
    intent_strength: any
    show_intent: boolean
    has_intent_signal_account: boolean
    intent_signal_account: any
    market_cap?: string
}

export interface PrimaryPhone {
    number: string
    source: string
    sanitized_number: string
}

export interface IndustryTagHash {
    'information technology & services'?: string
    'marketing & advertising'?: string
    internet?: string
}

export interface Account {
    id: string
    domain: string
    name: string
    team_id: string
    organization_id: string
    account_stage_id: string
    source: string
    original_source: string
    creator_id: any
    owner_id?: string
    created_at: string
    phone: string
    phone_status: string
    hubspot_id: string
    salesforce_id: any
    crm_owner_id?: string
    parent_account_id: any
    linkedin_url: any
    sanitized_phone: string
    account_playbook_statuses: any[]
    account_rule_config_statuses: any[]
    existence_level: string
    label_ids: any[]
    typed_custom_fields: TypedCustomFields
    modality: string
    hubspot_record_url: string
    crm_record_url: string
    intent_strength: any
    show_intent: boolean
    has_intent_signal_account: boolean
    intent_signal_account: any
}

export interface TypedCustomFields {}

export interface DepartmentalHeadCount {
    engineering: number
    marketing: number
    sales: number
    entrepreneurship: number
    information_technology: number
    business_development: number
    human_resources: number
    support: number
    consulting: number
    arts_and_design: number
    data_science: number
    operations: number
    legal: number
    finance: number
    media_and_commmunication: number
    education: number
    administrative: number
    accounting: number
    product_management: number
}
