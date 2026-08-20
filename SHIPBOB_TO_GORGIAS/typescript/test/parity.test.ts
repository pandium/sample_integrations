// Not in the Python suite: the cron and webhook flows resolve "the same customer" via the
// same GorgiasAPI helpers (customerKey/validEmail), but Python's separate test files never
// cross-check that a matching recipient produces the same key from both an order and a
// shipment-event fixture. Guards against that drifting.

import assert from 'node:assert/strict'
import { test } from 'node:test'

import { GorgiasAPI } from '../src/gorgias.js'
import { GORGIAS_SECRETS, makeOrder, makePandium, makeShipmentEvent } from './helpers.js'

test('customerKey resolves the same key for a matching recipient across an order and a shipment event', () => {
    const api = new GorgiasAPI(makePandium({ secrets: GORGIAS_SECRETS }))

    const order = makeOrder(1, '2026-07-01T00:00:00Z', { email: 'jane@example.com' })
    const event = makeShipmentEvent(1, 'Delivered', 'jane@example.com')
    assert.equal(api.customerKey(order), api.customerKey(event))
})
