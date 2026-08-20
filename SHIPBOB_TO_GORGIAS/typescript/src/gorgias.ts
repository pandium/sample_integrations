/**
 * Gorgias API client.
 *
 * The cron flow upserts customers (writing ShipBob order history to
 * `data.pandium.shipbob_orders`); the webhook flow creates tickets.
 *
 * Auth is OAuth2 via Pandium's `gorgias-oauth` connector. Pandium runs the authorization
 * flow when the tenant connects and refreshes the token on its own schedule, so this client
 * never sees a client secret, never posts to a token endpoint, and holds no refresh logic —
 * it reads whatever access token is current for this run and sends it as a bearer token. A
 * refresh that fails is a platform concern and surfaces as **Failed (Refresh)** on the run,
 * not as an error this code has to handle.
 */

import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import { deepGet } from './lib.js'
import { getLogger } from './logger.js'
import { Pandium } from './lib.js'

const logger = getLogger(import.meta.url)

// Gorgias validates the shape of an email; mirror the check the older integration
// used so we agree on which recipients get an email-keyed customer.
const EMAIL_RE =
    /^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([\]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])$/

// ShipBob timestamps are documented UTC. Rather than parsing into a Date (whose local-time
// getters/formatters would silently convert to the server's local timezone) this just
// rearranges the digits already in the string, so no timezone conversion can happen.
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?/

function formatDate(value?: string): string {
    if (!value) return ''
    const m = ISO_RE.exec(value)
    if (!m) return value // unparseable -> pass through
    const [, y, mo, d, h, mi, s] = m
    return `${d}/${mo}/${y} ${h}:${mi}:${s} UTC`
}

export interface GorgiasClient {
    findCustomer(opts: { email?: string; externalId?: string }): Promise<any | null>
    createCustomer(payload: any): Promise<number>
    updateCustomer(id: number, payload: any): Promise<void>
    createTicket(payload: any): Promise<any>
    validEmail(email?: string): string
    customerKey(sbOrder: any): string
    newCustomerPayload(sbOrder: any, key: string): any
    orderDataPayload(sbOrder: any): any
}

export class GorgiasAPI implements GorgiasClient {
    apiUrl: string
    private session: AxiosInstance

    constructor(pandium: Pandium) {
        const secrets = pandium.secrets
        const token = secrets['gorgias_oauth_access_token']
        const account = secrets['gorgias_oauth_account']
        if (!token || !account) {
            throw new Error(
                'PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN and PAN_SEC_GORGIAS_OAUTH_ACCOUNT are required'
            )
        }

        this.apiUrl = `https://${account.toLowerCase()}.gorgias.com/api`

        // The connector reports its own scheme; every current Gorgias token is a bearer.
        const tokenType = secrets['gorgias_oauth_token_type'] || 'Bearer'
        const session = axios.create({
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `${tokenType} ${token}`,
            },
        })
        axiosRetry(session, {
            retries: 6,
            retryCondition: (err) =>
                [429, 502, 503, 504].includes(err.response?.status ?? 0) &&
                ['get', 'post', 'put'].includes((err.config?.method ?? '').toLowerCase()),
            retryDelay: (retryCount) => 2000 * 2 ** (retryCount - 1),
        })
        this.session = session
    }

    // --- customers (cron flow) -------------------------------------------------

    /** Look a customer up by email or externalId and return the detail record (so
     * callers can read `data`), or null if not found. A given email/externalId maps
     * to at most one customer, so no pagination needed. */
    async findCustomer(opts: { email?: string; externalId?: string }): Promise<any | null> {
        const { email, externalId } = opts
        logger.info(`looking for gorgias customer: ${email}, ${externalId}`)
        let query: string
        if (email) {
            query = `email=${encodeURIComponent(email.toLowerCase())}`
        } else if (externalId) {
            query = `external_id=${encodeURIComponent(externalId)}`
        } else {
            return null
        }

        const res = await this.session.get(`${this.apiUrl}/customers?${query}`)
        const rows = res.data?.data ?? []
        if (!rows.length) {
            logger.info('Customer not found')
            return null
        }

        const detail = await this.session.get(`${this.apiUrl}/customers/${rows[0].id}`)
        logger.info('Customer found')
        return detail.data
    }

    async createCustomer(payload: any): Promise<number> {
        logger.info('creating new gorgias customer')
        try {
            const res = await this.session.post(`${this.apiUrl}/customers`, payload)
            logger.info('Customer created successfully')
            return res.data.id
        } catch (err: any) {
            logger.error(`Create customer failed: ${err.response?.data ?? err}`)
            throw err
        }
    }

    async updateCustomer(customerId: number, payload: any): Promise<void> {
        logger.info(`updating gorgias customer ${customerId}`)
        try {
            await this.session.put(`${this.apiUrl}/customers/${customerId}`, payload)
            logger.info('customer updated')
        } catch (err: any) {
            logger.error(`Update customer ${customerId} failed: ${err.response?.data ?? err}`)
            throw err
        }
    }

    // --- tickets (webhook flow) ---------------------------------------------------

    async createTicket(payload: any): Promise<any> {
        logger.info('creating gorgias ticket')
        try {
            const res = await this.session.post(`${this.apiUrl}/tickets`, payload)
            return res.data
        } catch (err: any) {
            logger.error(`Create ticket failed: ${err.response?.data ?? err}`)
            throw err
        }
    }

    // --- helpers ------------------------------------------------------------

    /** Return `email` if Gorgias would accept it, else ''. */
    validEmail(email?: string): string {
        if (email && !email.includes('.@') && EMAIL_RE.test(email)) return email
        return ''
    }

    /** The key identifying an order's customer: a valid recipient email when
     * present, otherwise a synthetic `name address1 city country`. */
    customerKey(sbOrder: any): string {
        const email = this.validEmail(deepGet(sbOrder, 'recipient.email', ''))
        if (email) return email
        const address = deepGet(sbOrder, 'recipient.address', {})
        return [
            deepGet(sbOrder, 'recipient.name', '') || '',
            deepGet(address, 'address1', '') || '',
            deepGet(address, 'city', '') || '',
            deepGet(address, 'country', '') || '',
        ].join(' ')
    }

    /** Body for POST /customers when the customer does not yet exist. */
    newCustomerPayload(sbOrder: any, key: string): any {
        const payload: any = {
            name: deepGet(sbOrder, 'recipient.name', ''),
            external_id: key,
            data: { pandium: { shipbob_orders: [] } },
        }
        const email = this.validEmail(deepGet(sbOrder, 'recipient.email', ''))
        if (email) payload.email = email
        return payload
    }

    /** The single order entry stored in `data.pandium.shipbob_orders`. */
    orderDataPayload(sbOrder: any): any {
        const shipments = deepGet<any[]>(sbOrder, 'shipments', []) || []
        for (const shipment of shipments) {
            for (const field of ['estimated_fulfillment_date', 'actual_fulfillment_date']) {
                if (shipment[field]) shipment[field] = formatDate(shipment[field])
            }
            shipment.url = `https://web.shipbob.com/App/Merchant/#/Orders/${shipment.id ?? ''}/`
        }
        return {
            id: deepGet(sbOrder, 'id', ''),
            created_date: formatDate(deepGet(sbOrder, 'created_date', '')),
            purchase_date: formatDate(deepGet(sbOrder, 'purchase_date', '')),
            reference_id: deepGet(sbOrder, 'reference_id', ''),
            order_number: deepGet(sbOrder, 'order_number', ''),
            status: deepGet(sbOrder, 'status', ''),
            type: deepGet(sbOrder, 'type', ''),
            channel: deepGet(sbOrder, 'channel', {}),
            shipping_method: deepGet(sbOrder, 'shipping_method', ''),
            recipient: deepGet(sbOrder, 'recipient', {}),
            products: deepGet(sbOrder, 'products', []),
            tags: deepGet(sbOrder, 'tags', []),
            shipments,
        }
    }
}
