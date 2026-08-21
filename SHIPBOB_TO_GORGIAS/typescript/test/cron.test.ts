import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'

import * as cron from '../src/cron.js'
import { ShipBobClient } from '../src/shipbob.js'
import { GORGIAS_SECRETS, makeOrder, makePandium, recordingGorgias } from './helpers.js'

let originalLog: typeof console.log
let logged: string[]

beforeEach(() => {
    originalLog = console.log
    logged = []
    console.log = (...args: any[]) => {
        logged.push(args.join(' '))
    }
})

afterEach(() => {
    console.log = originalLog
})

/** Serves canned pages of new orders (no updated orders); records page numbers. */
class FakeShipBob implements ShipBobClient {
    pages: number[] = []
    constructor(private newPages: any[][]) {}

    async getNewOrdersPage(_cursor: Date, page: number) {
        this.pages.push(page)
        return this.newPages[page - 1] ?? []
    }
    async getUpdatedOrdersPage(_cursor: Date, _page: number) {
        return []
    }
    getUpdateDate(order: any, _cursor: Date) {
        return order.shipments[0].last_update_at
    }
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
    const pages = [
        [
            makeOrder(1, '2026-07-05T10:00:00.1234567+00:00', { email: 'jane@example.com' }),
            makeOrder(2, '2026-07-06T10:00:00.1234567+00:00', { email: 'jane@example.com' }),
        ],
    ]
    const shipbob = new FakeShipBob(pages)
    const gorgias = recordingGorgias()

    const record = await cron.run(
        makePandium({ secrets: GORGIAS_SECRETS, config: { order_start_date: '2026-07-01' } }),
        { shipbob, gorgias }
    )

    assert.deepEqual(shipbob.pages, [1, 2]) // paged until the empty page
    assert.equal(gorgias.log.create.length, 1) // both orders batch onto one customer
    assert.equal(record.new_order_start_date, '2026-07-06T10:00:00.123456') // advanced to last order
    const finalOrders = gorgias.log.update[gorgias.log.update.length - 1][1].data.pandium.shipbob_orders
    assert.deepEqual(
        finalOrders.map((o: any) => o.id).sort(),
        [1, 2]
    )
})

test('run advances updated cursor to the oldest update seen across pages, not the last one processed', async () => {
    const ago = (days: number) => {
        const d = new Date(Date.now() - days * 86400000)
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
            d.getUTCHours()
        )}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.000+00:00`
    }

    class Updating implements ShipBobClient {
        pages: number[] = []
        private updatedPages = [
            [makeOrder(1, ago(2), { email: 'j@x.com' }), makeOrder(2, ago(3), { email: 'j@x.com' })],
            [makeOrder(3, ago(9), { email: 'j@x.com' }), makeOrder(4, ago(8), { email: 'j@x.com' })], // oldest update overall
            [makeOrder(5, ago(4), { email: 'j@x.com' })], // newer again, after the oldest page
        ]
        async getNewOrdersPage(_c: Date, _p: number) {
            return []
        }
        async getUpdatedOrdersPage(_cursor: Date, page: number) {
            return this.updatedPages[page - 1] ?? []
        }
        getUpdateDate(order: any, _cursor: Date) {
            return order.shipments[0].last_update_at
        }
    }

    const shipbob = new Updating()
    const gorgias = recordingGorgias()

    const record = await cron.run(
        makePandium({ secrets: GORGIAS_SECRETS, config: { order_start_date: ago(20) } }),
        { shipbob, gorgias }
    )

    assert.equal(record.updated_order_start_date, ago(9).slice(0, 23)) // not order 5, the last one processed
})

test('run flushes the partial cursor and exits zero on timeout', async () => {
    class WatchdogExit extends Error {
        constructor(public code: number) {
            super(`exit ${code}`)
        }
    }

    let capturedOnTimeout: (() => void) | undefined
    const armWatchdog = (onTimeout: () => void) => {
        capturedOnTimeout = onTimeout
        return { cancel: () => {} }
    }
    const exit = (code: number): never => {
        throw new WatchdogExit(code)
    }

    class Alarming implements ShipBobClient {
        async getNewOrdersPage(_cursor: Date, page: number) {
            if (page === 1) {
                return [makeOrder(1, '2026-07-05T10:00:00.1234567+00:00', { email: 'j@x.com' })]
            }
            capturedOnTimeout?.() // trip the watchdog before page 2 is processed
            return [makeOrder(2, '2026-07-06T10:00:00.1234567+00:00', { email: 'j@x.com' })]
        }
        async getUpdatedOrdersPage(_cursor: Date, _page: number) {
            return []
        }
        getUpdateDate(order: any, _cursor: Date) {
            return order.shipments[0].last_update_at
        }
    }

    const shipbob = new Alarming()
    const gorgias = recordingGorgias()

    await assert.rejects(
        cron.run(makePandium({ secrets: GORGIAS_SECRETS, config: { order_start_date: '2026-07-01' } }), {
            shipbob,
            gorgias,
            armWatchdog,
            exit,
        }),
        (err: any) => {
            assert.ok(err instanceof WatchdogExit)
            assert.equal(err.code, 0) // timed-out run still succeeds so progress is merged
            return true
        }
    )

    const flushed = JSON.parse(logged[logged.length - 1])
    assert.equal(flushed.new_order_start_date, '2026-07-05T10:00:00.123456') // only order 1 processed
})
