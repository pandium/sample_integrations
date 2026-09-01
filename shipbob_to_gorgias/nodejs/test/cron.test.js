import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'

import * as cron from '../cron.js'
import { GORGIAS_SECRETS, makeOrder, makePandium, recordingGorgias } from './helpers.js'

let originalLog
let logged

beforeEach(() => {
    originalLog = console.log
    logged = []
    console.log = (...args) => {
        logged.push(args.join(' '))
    }
})

afterEach(() => {
    console.log = originalLog
})

/**
 * Serves canned pages for either half and records the pages asked for.
 *
 * `onPage` runs before a page is served, which is where a test stands in for
 * the watchdog tripping or the API going away mid-query.
 */
class FakeShipBob {
    constructor({ newPages = [], updatedPages = [], onPage } = {}) {
        this.newPages = newPages
        this.updatedPages = updatedPages
        this.onPage = onPage ?? (() => {})
        this.pages = { new: [], updated: [] }
    }

    _page(half, pages, page) {
        this.pages[half].push(page)
        this.onPage(half, page)
        return pages[page - 1] ?? []
    }

    async getNewOrdersPage(_cursor, page) {
        return this._page('new', this.newPages, page)
    }
    async getUpdatedOrdersPage(_cursor, page) {
        return this._page('updated', this.updatedPages, page)
    }
    getUpdateDate(order, _cursor) {
        return order.shipments[0].last_update_at
    }
}

/** A ShipBob-shaped timestamp `days` back — seven fractional digits, as the
 * real API sends — inside clamp's 30-day window. */
function ago(days) {
    const d = new Date(Date.now() - days * 86400000)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
    )}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.1234567+00:00`
}

test('clamp bounds a cursor to [now-30d, now]', () => {
    const now = new Date('2026-07-16T12:00:00Z')
    assert.equal(cron.clamp('2026-07-10T00:00:00Z', now).toISOString(), new Date('2026-07-10T00:00:00Z').toISOString())
    assert.equal(cron.clamp('2099-01-01T00:00:00Z', now).toISOString(), now.toISOString()) // future -> now
    assert.equal(
        cron.clamp(null, now).toISOString(),
        new Date(now.getTime() - cron.ONE_MONTH_MS).toISOString()
    ) // missing -> floor
})

test('run pages new orders until empty, batches one customer, advances cursor', async () => {
    const shipbob = new FakeShipBob({
        newPages: [
            [
                makeOrder(1, ago(6), { email: 'jane@example.com' }),
                makeOrder(2, ago(5), { email: 'jane@example.com' }),
            ],
        ],
    })
    const gorgias = recordingGorgias()

    const record = await cron.run(
        makePandium({ secrets: GORGIAS_SECRETS, config: { order_start_date: ago(20) } }),
        { shipbob, gorgias }
    )

    assert.deepEqual(shipbob.pages.new, [1, 2]) // paged until the empty page
    assert.equal(gorgias.log.create.length, 1) // both orders batch onto one customer
    assert.equal(record.new_order_start_date, ago(5).slice(0, 26)) // advanced to the last order
    const finalOrders = gorgias.log.update[gorgias.log.update.length - 1][1].data.pandium.shipbob_orders
    assert.deepEqual(
        finalOrders.map((o) => o.id).sort(),
        [1, 2]
    )
})

test('run advances updated cursor to the oldest update seen across pages, not the last one processed', async () => {
    const shipbob = new FakeShipBob({
        updatedPages: [
            [makeOrder(1, ago(2), { email: 'j@x.com' }), makeOrder(2, ago(3), { email: 'j@x.com' })],
            [makeOrder(3, ago(9), { email: 'j@x.com' }), makeOrder(4, ago(8), { email: 'j@x.com' })], // oldest update overall
            [makeOrder(5, ago(4), { email: 'j@x.com' })], // newer again, after the oldest page
        ],
    })
    const gorgias = recordingGorgias()

    const record = await cron.run(
        makePandium({ secrets: GORGIAS_SECRETS, config: { order_start_date: ago(20) } }),
        { shipbob, gorgias }
    )

    assert.equal(record.updated_order_start_date, ago(9).slice(0, 23)) // not order 5, the last processed
})

test('timeout flushes the finished half and leaves the interrupted one', async () => {
    // The two cursors resume differently. new_order_start_date climbs per order
    // over an oldest-first query, so it is sound wherever the run stops.
    // updated_order_start_date is the minimum across every page, so it only holds
    // once the query is exhausted — an unread page can carry an older update —
    // and a run cut short flushes the value it started with.
    class WatchdogExit extends Error {
        constructor(code) {
            super(`exit ${code}`)
            this.code = code
        }
    }

    let capturedOnTimeout
    const armWatchdog = (onTimeout) => {
        capturedOnTimeout = onTimeout
        return { cancel: () => {} }
    }
    const exit = (code) => {
        throw new WatchdogExit(code)
    }

    const now = new Date()
    const start = ago(20)
    const shipbob = new FakeShipBob({
        newPages: [[makeOrder(1, ago(6), { email: 'j@x.com' })]],
        updatedPages: [
            [makeOrder(2, ago(2), { email: 'j@x.com' })],
            [makeOrder(3, ago(9), { email: 'j@x.com' })], // never read
        ],
        onPage: (half, page) => {
            if (half === 'updated' && page === 2) capturedOnTimeout?.()
        },
    })
    const gorgias = recordingGorgias()

    await assert.rejects(
        cron.run(makePandium({ secrets: GORGIAS_SECRETS, config: { order_start_date: start } }), {
            shipbob,
            gorgias,
            armWatchdog,
            exit,
            now,
        }),
        (err) => {
            assert.ok(err instanceof WatchdogExit)
            assert.equal(err.code, 0) // a timed-out run still succeeds, so progress merges
            return true
        }
    )

    const flushed = JSON.parse(logged[logged.length - 1])
    assert.equal(flushed.new_order_start_date, ago(6).slice(0, 26)) // that half finished
    assert.equal(flushed.updated_order_start_date, cron.clamp(start, now).toISOString()) // this one did not
})
