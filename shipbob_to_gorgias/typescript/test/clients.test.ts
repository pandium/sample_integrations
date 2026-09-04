import assert from 'node:assert/strict'
import { test } from 'node:test'

import { GorgiasAPI } from '../src/gorgias.js'
import { DEFAULT_BASE_URL, resolveBaseUrl, ShipBobAPI } from '../src/shipbob.js'
import { GORGIAS_SECRETS, makeOrder, makePandium } from './helpers.js'

function token(iss: string): string {
    const payload = Buffer.from(JSON.stringify({ iss })).toString('base64url')
    return `header.${payload}.sig`
}

test('resolveBaseUrl maps issuer to base URL, defaults to prod', () => {
    assert.equal(resolveBaseUrl(token('https://authstage.shipbob.com')), 'https://sandbox-api.shipbob.com/2026-01')
    assert.equal(resolveBaseUrl(token('https://auth.shipbob.com')), 'https://api.shipbob.com/2026-01')
    assert.equal(resolveBaseUrl('not-a-jwt'), DEFAULT_BASE_URL)
})

/** Answers every GET with one canned response, standing in for the network. */
class StubSession {
    constructor(private status: number, private body: any) {}
    async get() {
        if (this.status >= 400) {
            const err: any = new Error(`Request failed with status code ${this.status}`)
            err.response = { status: this.status }
            throw err
        }
        return { data: this.body }
    }
}

test('getOrders raises instead of reporting itself empty', async () => {
    // The cron loop stops on an empty page and commits its cursor there, so only
    // an exhausted query may answer with one.
    const api = new ShipBobAPI(
        makePandium({ secrets: { shipbob_access_token: token('https://auth.shipbob.com') } })
    ) as any
    const start = new Date('2026-07-01T00:00:00Z')

    api.session = new StubSession(200, [])
    assert.deepEqual(await api.getNewOrdersPage(start, 1), []) // exhausted

    api.session = new StubSession(503, null)
    await assert.rejects(api.getNewOrdersPage(start, 1)) // a failure, not an empty page

    api.session = new StubSession(200, { errors: ['nope'] })
    await assert.rejects(api.getNewOrdersPage(start, 1)) // a 200 that is not a page of orders either
})

test('GorgiasAPI sets apiUrl and Authorization header from secrets', () => {
    const api = new GorgiasAPI(makePandium({ secrets: GORGIAS_SECRETS })) as any
    assert.equal(api.apiUrl, 'https://acme.gorgias.com/api')
    assert.equal(api.session.defaults.headers['Authorization'], 'Bearer gorgias-token-123')
    assert.equal(api.session.defaults.auth, undefined) // no basic auth left anywhere
})

test('customerKey returns email or synthetic name/address key', () => {
    const api = new GorgiasAPI(makePandium({ secrets: GORGIAS_SECRETS }))
    assert.equal(api.customerKey(makeOrder(1, 'x', { email: 'jane@example.com' })), 'jane@example.com')
    assert.equal(api.customerKey(makeOrder(1, 'x', { email: null })), 'Buyer 1 Main St NY US')
})
