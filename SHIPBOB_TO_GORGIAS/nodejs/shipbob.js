/**
 * ShipBob API client — reads orders for the cron sync.
 *
 * Auth is a single bearer token (`PAN_SEC_SHIPBOB_ACCESS_TOKEN`). The base URL is
 * resolved from the token's issuer (`iss`) claim, so the same code targets prod,
 * sandbox, or QA depending on which token the tenant connected.
 */

import axios from 'axios'
import axiosRetry from 'axios-retry'

import { getLogger } from './logger.js'

const logger = getLogger(import.meta.url)

// ShipBob issues tokens from different auth hosts per environment; map each to its
// matching API base URL. Anything unrecognized falls back to prod.
const AUTH_URL_TO_BASE_URL = {
    'https://authstage.shipbob.com': 'https://sandbox-api.shipbob.com/2026-01',
    'https://auth.shipbob.com': 'https://api.shipbob.com/2026-01',
}
export const DEFAULT_BASE_URL = 'https://api.shipbob.com/2026-01'

/** Decode the JWT payload and map its `iss` claim to an API base URL. */
export function resolveBaseUrl(token) {
    try {
        const payload = token.split('.')[1]
        const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
        return AUTH_URL_TO_BASE_URL[claims.iss] ?? DEFAULT_BASE_URL
    } catch (err) {
        logger.error(`Could not resolve ShipBob base URL from token: ${err}`)
        return DEFAULT_BASE_URL
    }
}

/** `YYYY-MM-DDTHH:mm:ss.SSSSSS` — Date only has millisecond precision, so the
 * fractional part is padded with three zeros. */
function formatNaive(d) {
    const iso = d.toISOString() // '...SSSZ'
    return iso.slice(0, -1).replace(/(\.\d{3})$/, '$1000')
}

export class ShipBobAPI {
    constructor(pandium) {
        const token = pandium.secrets['shipbob_access_token']
        if (!token) {
            throw new Error('PAN_SEC_SHIPBOB_ACCESS_TOKEN is required')
        }

        this.apiUrl = resolveBaseUrl(token)

        const session = axios.create({
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        // Exponential backoff: 3s, 6s, 12s, ... Only GET is ever called by this client.
        axiosRetry(session, {
            retries: 6,
            retryCondition: (err) => [429, 502, 503, 504].includes(err.response?.status ?? 0),
            retryDelay: (retryCount) => 3000 * 2 ** (retryCount - 1),
        })
        this.session = session
    }

    /** GET one page of `/order`. Returns [] on error or empty page. */
    async getOrders(params) {
        try {
            const res = await this.session.get(`${this.apiUrl}/order`, { params })
            return Array.isArray(res.data) ? res.data : []
        } catch (err) {
            logger.error(`ShipBob order fetch failed (${JSON.stringify(params)}): ${err}`)
            return []
        }
    }

    /** One page of orders created since `startDate`, oldest first. */
    async getNewOrdersPage(startDate, page) {
        return this.getOrders({ StartDate: startDate.toISOString(), Page: page, SortOrder: 'Oldest' })
    }

    /**
     * One page of orders updated since `startDate`.
     *
     * ShipBob puts `last_update_at` on shipments, not orders, so we derive a
     * per-order update timestamp and sort the page newest-first. Advancing the
     * cursor to the oldest processed update keeps the sync conservative: a
     * timed-out run never skips an update, at the cost of some reprocessing
     * (which is harmless — customer writes are idempotent PUTs).
     */
    async getUpdatedOrdersPage(startDate, page) {
        const orders = await this.getOrders({ LastUpdateStartDate: startDate.toISOString(), Page: page })
        const keyed = orders.map((order) => ({ order, key: this.getUpdateDate(order, startDate) }))
        keyed.sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0)) // newest first
        return keyed.map(({ order }) => order)
    }

    /** The oldest shipment `last_update_at` on `order` that still falls after
     * `startDate`; defaults to now when none qualify. */
    getUpdateDate(order, startDate) {
        const startStr = formatNaive(startDate)
        let updateDate = formatNaive(new Date())
        for (const shipment of order.shipments ?? []) {
            const ts = shipment?.last_update_at
            if (ts && startStr < ts && ts < updateDate) updateDate = ts
        }
        return updateDate
    }
}
