/**
 * The webhook flow: any ShipBob order webhook -> a Gorgias ticket.
 *
 * ShipBob's order-related topics (`order_shipped`, `shipment_delivered`,
 * `shipment_exception`, `shipment_onhold`, `shipment_cancelled`) all deliver the
 * same **shipment** object, differing only in `status`/`status_details`. This flow
 * opens a ticket for every one of them, so support sees a shipment the moment it needs
 * attention rather than only once it lands.
 *
 * Each webhook run may carry N debounced deliveries (Pandium bundles triggers that
 * arrive while a run is in flight), so we loop over every trigger. Creating a ticket is
 * not idempotent and ShipBob retries any delivery that doesn't get a 2xx, so we dedupe
 * on `shipment_id:status` using a `processed_events` map in tenant metadata, pruned
 * to a 30-minute window. Keying on the status as well as the shipment means a redelivery
 * is suppressed while a genuine *next* status for the same shipment still opens a ticket.
 *
 * Because tenant metadata is shallow-merged at the top level, writing the whole
 * `processed_events` object *replaces* the previous one (dropped keys are really
 * removed) while leaving the cron flow's cursor keys untouched.
 *
 * Pandium verifies each delivery's signature before it ever reaches a run, so the bodies
 * handed to this module are already known to have come from ShipBob.
 */

import log4js from 'log4js'

import { GorgiasAPI } from './gorgias.js'
import { deepGet } from './lib.js'

// lib.js configures log4js; this just gets a logger named for this file.
const logger = log4js.getLogger('webhook')

export const PRUNE_WINDOW_MS = 30 * 60 * 1000
export const SHIPMENT_TAG = 'shipbob-shipment'

/** Drop entries whose timestamp is more than PRUNE_WINDOW_MS old (or unparseable). */
export function prune(processed, now) {
    const kept = {}
    for (const [eventKey, ts] of Object.entries(processed)) {
        const when = new Date(ts).getTime()
        if (Number.isNaN(when)) continue // unparseable -> treat as expired
        if (now.getTime() - when <= PRUNE_WINDOW_MS) kept[eventKey] = ts
    }
    return kept
}

/** ShipBob names the shipment `id` on the webhook body; older docs and some
 * topics call it `shipment_id`. Accept either. */
export function shipmentId(event) {
    return String(deepGet(event, 'id', '') || deepGet(event, 'shipment_id', ''))
}

/** The human-readable reasons ShipBob attached to this status, e.g.
 * `Invalid Address; Payment Failure`. Empty for statuses that carry none. */
function statusDetails(event) {
    const details = deepGet(event, 'status_details', []) || []
    return details
        .filter((d) => d)
        .map((d) => d.description || d.name || '')
        .join('; ')
}

/** One line per product on the shipment: `4 x 16 oz. Shampoo (PIN-100)`. */
function items(event) {
    const lines = []
    for (const product of deepGet(event, 'products', []) || []) {
        const quantity = (product.inventory_items ?? []).reduce((sum, i) => sum + (i.quantity || 0), 0)
        const sku = product.sku || product.reference_id || ''
        lines.push(`${quantity} x ${product.name || ''}` + (sku ? ` (${sku})` : ''))
    }
    return lines.join('\n')
}

/**
 * Build the POST /tickets payload for a shipment webhook of any status.
 *
 * `customerRef` is the `{id: ...}` returned by `resolveCustomer`. Gorgias wants
 * the customer twice — once as the ticket's owner and once as the sender of its
 * first message — so the same reference goes in both slots.
 */
export function buildTicket(event, customerRef) {
    const sid = shipmentId(event)
    const orderId = deepGet(event, 'order_id', '')
    const referenceId = deepGet(event, 'reference_id', '') || orderId
    const status = deepGet(event, 'status', 'Updated')
    const reasons = statusDetails(event)
    const carrier = deepGet(event, 'tracking.carrier', '')
    const trackingNumber = deepGet(event, 'tracking.tracking_number', '')
    const deliveredOn = (deepGet(event, 'delivery_date', '') || '').slice(0, 10) // YYYY-MM-DD

    const headline = `Shipment ${sid} for order ${referenceId} is now ${status}.`

    // Only the parts ShipBob actually sent for this status make it into the body —
    // an OnHold shipment has no tracking, a Delivered one has no status details.
    const lines = [headline]
    if (reasons) lines.push(`Reason: ${reasons}`)
    if (carrier || trackingNumber) lines.push(`Tracking: ${carrier} ${trackingNumber}`.trim())
    if (deliveredOn) lines.push(`Delivered on: ${deliveredOn}`)
    const itemLines = items(event)
    if (itemLines) lines.push(`Items:\n${itemLines}`)
    const bodyText = lines.join('\n')

    const html = [`<p>${headline}</p>`]
    if (reasons) html.push(`<p><b>Reason:</b> ${reasons}</p>`)
    if (carrier || trackingNumber) html.push(`<p><b>Tracking:</b> ${carrier} ${trackingNumber}</p>`)
    if (itemLines) html.push('<ul>' + itemLines.split('\n').map((line) => `<li>${line}</li>`).join('') + '</ul>')

    const message = {
        sender: customerRef,
        channel: 'api',
        via: 'api',
        from_agent: false,
        subject: `Order ${referenceId}: shipment ${status}`,
        body_text: bodyText,
        body_html: html.join(''),
        // Included so Gorgias auto-reply / keyword rules can fire.
        stripped_text: headline,
    }
    return {
        customer: customerRef,
        channel: 'api',
        via: 'api',
        from_agent: false,
        status: 'open',
        messages: [message],
        // A constant tag to find every ticket this flow opened, plus the status so
        // Gorgias rules can route (e.g. OnHold) without parsing the body.
        tags: [{ name: SHIPMENT_TAG }, { name: `shipbob-${String(status).toLowerCase().replace(/\s/g, '-')}` }],
    }
}

/**
 * Find-or-create the Gorgias customer for a shipment's recipient and return the
 * reference to attach the ticket to.
 *
 * Uses the same key the cron flow does — a valid recipient email when there is one,
 * otherwise the synthetic `name address1 city country` external_id — so a webhook
 * ticket lands on the same record that carries the customer's order history. A
 * recipient email is optional on a ShipBob shipment, so the external_id path carries
 * as much weight here as it does in the cron flow.
 */
export async function resolveCustomer(gorgias, event) {
    const email = gorgias.validEmail(deepGet(event, 'recipient.email', ''))
    const key = gorgias.customerKey(event)

    const existing = await gorgias.findCustomer(email ? { email } : { externalId: key })
    if (existing) return { id: existing.id }
    return { id: await gorgias.createCustomer(gorgias.newCustomerPayload(event, key)) }
}

export async function run(pandium, deps = {}) {
    const now = new Date()
    const metadata = pandium.metadata() ?? {}
    const processed = prune(metadata.processed_events ?? {}, now)

    const gorgias = deps.gorgias ?? new GorgiasAPI(pandium)
    const nowIso = now.toISOString()
    let created = 0

    // Pandium bundles debounced deliveries into one run; lib.Pandium reads each raw body
    // back off disk so this loop only has to deal with the event itself.
    for (const payload of pandium.webhookPayloads()) {
        const event = payload.body

        const sid = shipmentId(event)
        if (!sid) {
            logger.error(`Webhook delivery ${payload.id} has no shipment id; skipping.`)
            continue
        }

        // Every order webhook gets a ticket, whatever the status — the status is only
        // part of the dedupe key, never a filter.
        const status = deepGet(event, 'status', 'Updated')
        const eventKey = `${sid}:${status}`
        if (eventKey in processed) {
            logger.info(`Shipment ${sid} is already ticketed as ${status}; skipping duplicate.`)
            continue
        }

        let customerRef
        try {
            customerRef = await resolveCustomer(gorgias, event)
        } catch (err) {
            logger.error(`Could not resolve a Gorgias customer for shipment ${sid}: ${err}`)
            continue // leave unprocessed so ShipBob's retry can try again
        }

        let ticket
        try {
            ticket = await gorgias.createTicket(buildTicket(event, customerRef))
        } catch (err) {
            logger.error(`Failed to open ticket for shipment ${sid}: ${err}`)
            continue // leave unprocessed so ShipBob's retry can try again
        }

        processed[eventKey] = nowIso // mark handled
        created += 1
        logger.info(`Opened Gorgias ticket ${ticket?.id} for shipment ${sid} (${status}).`)
    }

    logger.info(`Webhook flow: opened ${created} ticket(s); tracking ${Object.keys(processed).length} event(s).`)
    // Replaces the map (30-min pruned); shallow merge leaves the cron flow's cursor keys intact.
    return { processed_events: processed }
}
