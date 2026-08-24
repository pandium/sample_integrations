/**
 * The cron flow: ShipBob orders -> Gorgias customer sidebar.
 *
 * Keeps each Gorgias customer's `data.pandium.shipbob_orders` in sync with that
 * customer's recent ShipBob orders. Runs on a schedule and resumes where the last
 * run left off, using tenant metadata as the cursor.
 *
 * The run is bounded at ~10 minutes by Pandium. To stay resumable, the loop keeps a
 * single in-memory *timeout record* (the cursor) current as each order is
 * processed, and a watchdog timer writes that record before the hard kill. Exiting
 * 0 on timeout means the partial cursor is merged into metadata and the next run
 * picks up from there.
 *
 * The deadline is an injectable setTimeout-based watchdog (see `armWatchdog`/`exit`
 * on the deps argument — the default uses a real timer and process.exit; tests
 * substitute both to trigger the timeout deterministically).
 */

import { GorgiasAPI } from './gorgias.js'
import { getLogger } from './logger.js'
import { ShipBobAPI } from './shipbob.js'

const logger = getLogger(import.meta.url)

export const ALARM_MS = 9 * 60 * 1000 // self-imposed 9-min alarm, ahead of Pandium's ~10-min kill
export const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_ORDERS_TO_SYNC = 10 // most recent N orders kept on each customer

/** Keep a cursor within [now - 1 month, now]. Unparseable/missing values fall
 * back to one month ago (the oldest window we ever fetch). */
export function clamp(value, now) {
    const floor = new Date(now.getTime() - ONE_MONTH_MS)
    const parsed = value === null || value === undefined ? NaN : new Date(String(value)).getTime()
    if (Number.isNaN(parsed)) return floor
    return new Date(Math.min(Math.max(parsed, floor.getTime()), now.getTime()))
}

/** Merge `orderPayload` into a customer's order list (replace by id, else
 * append), then sort and trim to the most recent MAX_ORDERS_TO_SYNC. */
export function upsert(orders, orderPayload, newestFirst) {
    for (let i = 0; i < orders.length; i++) {
        if (orders[i]?.id === orderPayload.id) {
            orders[i] = orderPayload
            return orders // in-place replace; no re-sort/trim needed
        }
    }

    orders.push(orderPayload)
    orders.sort((a, b) => ((a.id ?? 0) - (b.id ?? 0)) * (newestFirst ? -1 : 1))
    if (orders.length > MAX_ORDERS_TO_SYNC) {
        orders = newestFirst ? orders.slice(0, MAX_ORDERS_TO_SYNC) : orders.slice(-MAX_ORDERS_TO_SYNC)
    }
    return orders
}

/** Find-or-create the order's Gorgias customer, then PUT/POST its updated
 * `data.pandium.shipbob_orders`. `cache` accumulates customer payloads within a
 * run so multiple orders for one customer batch onto the same record. */
export async function processOrder(sbOrder, gorgias, cache, newestFirst) {
    const key = gorgias.customerKey(sbOrder)
    const email = gorgias.validEmail(sbOrder?.recipient?.email)

    if (!cache.has(key)) {
        let existing
        try {
            existing = await gorgias.findCustomer(email ? { email } : { externalId: key })
        } catch (err) {
            logger.error(`Skipping order ${sbOrder?.id ?? ''} — cannot fetch customer ${key}: ${err}`)
            return
        }

        if (existing) {
            // Anything already under data.pandium came from outside this
            // integration — a hand-edited customer can carry {"pandium": null} —
            // so check the type at every level rather than just the leaf.
            const data = existing.data && typeof existing.data === 'object' ? existing.data : {}
            let pandium = data.pandium && typeof data.pandium === 'object' ? data.pandium : {}
            if (!Array.isArray(pandium.shipbob_orders)) pandium.shipbob_orders = []
            data.pandium = pandium
            cache.set(key, { id: existing.id, data })
        } else {
            cache.set(key, gorgias.newCustomerPayload(sbOrder, key))
        }
    }

    const customer = cache.get(key)
    customer.data.pandium.shipbob_orders = upsert(
        customer.data.pandium.shipbob_orders,
        gorgias.orderDataPayload(sbOrder),
        newestFirst
    )

    try {
        if ('id' in customer) {
            await gorgias.updateCustomer(customer.id, customer)
        } else {
            customer.id = await gorgias.createCustomer(customer)
        }
    } catch (err) {
        logger.error(`Failed to upsert Gorgias customer ${key}: ${err}`)
    }
}

function defaultArmWatchdog(onTimeout) {
    const timer = setTimeout(onTimeout, ALARM_MS)
    timer.unref?.() // don't hold the process open past a normal, faster completion
    return { cancel: () => clearTimeout(timer) }
}

export async function run(pandium, deps = {}) {
    const now = deps.now ?? new Date()
    const exit = deps.exit ?? ((code) => process.exit(code))
    const armWatchdog = deps.armWatchdog ?? defaultArmWatchdog

    const metadata = pandium.metadata() ?? {}
    const fallback = pandium.config['order_start_date']

    const newCursor = clamp(metadata.new_order_start_date || fallback, now)
    const updatedCursor = clamp(metadata.updated_order_start_date || fallback, now)

    // The timeout record: the cursor written on either outcome. Values are ISO
    // strings advanced as orders are processed.
    const record = {
        new_order_start_date: newCursor.toISOString(),
        updated_order_start_date: updatedCursor.toISOString(),
    }

    const watchdog = armWatchdog(() => {
        logger.error('Approaching the run-time limit — flushing cursor for the next run.')
        // Same writer the normal path uses, so there is exactly one route to stdout.
        pandium.updateMetadata(record)
        exit(0) // timed-out run still counts as successful -> partial cursor merged
    })

    try {
        const shipbob = deps.shipbob ?? new ShipBobAPI(pandium)
        const gorgias = deps.gorgias ?? new GorgiasAPI(pandium)
        const newestFirst = String(pandium.config['newest_order_first'] ?? '').toLowerCase() === 'true'
        const cache = new Map()

        // New orders: SortOrder=Oldest, so created_date advances forward monotonically.
        logger.info(`Syncing new ShipBob orders since ${record.new_order_start_date}`)
        let page = 1
        while (true) {
            const orders = await shipbob.getNewOrdersPage(newCursor, page)
            if (!orders.length) break
            for (const order of orders) {
                logger.info(`Processing new order with id ${order.id}`)
                await processOrder(order, gorgias, cache, newestFirst)
                const created = order.created_date
                if (created) {
                    // created_date is YYYY-MM-DDThh:mm:ss.sssssss+00:00; trim to 26
                    // chars for a valid (naive, microsecond) date-time.
                    record.new_order_start_date = String(created).slice(0, 26)
                }
            }
            page += 1
        }

        // Updated orders: keyed off shipment last_update_at (see getUpdatedOrdersPage).
        logger.info(`Syncing updated ShipBob orders since ${record.updated_order_start_date}`)
        page = 1
        // Each page is sorted newest-first, but pages are not sorted relative to each
        // other, so the cursor has to be the running minimum across every processed
        // order — not whatever the last order of the last page happened to carry.
        // Tracked separately from the record because every update date is, by
        // construction, later than the starting cursor: folding the start value into
        // the min would pin the cursor there forever.
        let oldestUpdate = null
        while (true) {
            const orders = await shipbob.getUpdatedOrdersPage(updatedCursor, page)
            if (!orders.length) break
            for (const order of orders) {
                logger.info(`Processing updated order with id ${order.id}`)
                await processOrder(order, gorgias, cache, newestFirst)
                // last_update_at is YYYY-MM-DDThh:mm:ss.sss+00:00; trim to 23 chars.
                // Uniform width and format, so a string compare orders them correctly.
                const updateDate = shipbob.getUpdateDate(order, updatedCursor).slice(0, 23)
                if (oldestUpdate === null || updateDate < oldestUpdate) {
                    oldestUpdate = updateDate
                    record.updated_order_start_date = oldestUpdate
                }
            }
            page += 1
        }

        watchdog.cancel() // made it — no timeout to flush
        return record
    } catch (err) {
        watchdog.cancel()
        throw err
    }
}
