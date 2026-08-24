import assert from 'node:assert/strict'
import { test } from 'node:test'

import { GorgiasAPI } from '../gorgias.js'
import { DEFAULT_BASE_URL, resolveBaseUrl } from '../shipbob.js'
import { GORGIAS_SECRETS, makeOrder, makePandium } from './helpers.js'

function token(iss) {
    const payload = Buffer.from(JSON.stringify({ iss })).toString('base64url')
    return `header.${payload}.sig`
}

test('resolveBaseUrl maps issuer to base URL, defaults to prod', () => {
    assert.equal(resolveBaseUrl(token('https://authstage.shipbob.com')), 'https://sandbox-api.shipbob.com/2026-01')
    assert.equal(resolveBaseUrl(token('https://auth.shipbob.com')), 'https://api.shipbob.com/2026-01')
    assert.equal(resolveBaseUrl('not-a-jwt'), DEFAULT_BASE_URL)
})

test('GorgiasAPI sets apiUrl and Authorization header from secrets', () => {
    const api = new GorgiasAPI(makePandium({ secrets: GORGIAS_SECRETS }))
    assert.equal(api.apiUrl, 'https://acme.gorgias.com/api')
    assert.equal(api.session.defaults.headers['Authorization'], 'Bearer gorgias-token-123')
    assert.equal(api.session.defaults.auth, undefined) // no basic auth left anywhere
})

test('customerKey returns email or synthetic name/address key', () => {
    const api = new GorgiasAPI(makePandium({ secrets: GORGIAS_SECRETS }))
    assert.equal(api.customerKey(makeOrder(1, 'x', { email: 'jane@example.com' })), 'jane@example.com')
    assert.equal(api.customerKey(makeOrder(1, 'x', { email: null })), 'Buyer 1 Main St NY US')
})
