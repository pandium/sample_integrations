// Shared test doubles and factories — nothing here touches the network.

import * as fs from 'fs'
import * as path from 'path'

import { GorgiasAPI } from '../gorgias.js'
import { Pandium } from '../lib.js'

export const GORGIAS_SECRETS = {
    gorgias_oauth_access_token: 'gorgias-token-123',
    gorgias_oauth_account: 'acme',
}

/** Build a Pandium directly (no env). `metadata` is written to a temp file so
 * `pandium.metadata()` reads it back like the real thing. */
export function makePandium(opts = {}) {
    const context = {}
    if (opts.runMode !== undefined) context['run_mode'] = opts.runMode
    if (opts.runTriggers !== undefined) context['run_triggers'] = JSON.stringify(opts.runTriggers)
    if (opts.metadata !== undefined) {
        if (!opts.tmpDir) throw new Error('tmpDir is required when metadata is provided')
        const file = path.join(opts.tmpDir, 'metadata.json')
        fs.writeFileSync(file, JSON.stringify(opts.metadata))
        context['tenant_metadata_file'] = file
    }
    return new Pandium(opts.config ?? {}, opts.secrets ?? {}, context)
}

/** A real GorgiasAPI (so helper logic runs) with HTTP methods replaced by
 * in-memory recorders. `existingEmails` are pre-seeded as found customers;
 * inspect `api.log` in assertions. */
export function recordingGorgias(existingEmails = []) {
    const api = new GorgiasAPI(makePandium({ secrets: GORGIAS_SECRETS }))
    const store = new Map(existingEmails.map((email, i) => [email, 40 + i]))
    const log = { create: [], update: [], ticket: [] }

    api.findCustomer = async (opts) => {
        const key = opts.email || opts.externalId
        return key && store.has(key)
            ? { id: store.get(key), data: { pandium: { shipbob_orders: [] } } }
            : null
    }

    api.createCustomer = async (payload) => {
        const cid = 1000 + store.size
        store.set(payload.external_id ?? cid, cid)
        log.create.push(payload)
        return cid
    }

    api.updateCustomer = async (custId, payload) => {
        log.update.push([custId, JSON.parse(JSON.stringify(payload))]) // snapshot
    }

    api.createTicket = async (payload) => {
        log.ticket.push(payload)
        return { id: 900 + log.ticket.length }
    }

    api.log = log
    return api
}

export function makeOrder(id, created, opts = {}) {
    return {
        id,
        created_date: created,
        reference_id: `REF-${id}`,
        recipient: {
            email: opts.email ?? null,
            name: 'Buyer',
            address: { address1: '1 Main St', city: 'NY', country: 'US' },
        },
        shipments: [{ id: id * 10, last_update_at: opts.lastUpdate || created }],
    }
}

export function makeShipmentEvent(shipmentId = 456789, status = 'Delivered', email = 'jane@example.com', statusDetails = []) {
    return {
        id: shipmentId,
        order_id: 289012345,
        reference_id: 'MERCHANT-ORDER-1001',
        status,
        status_details: statusDetails,
        tracking: { carrier: 'USPS', tracking_number: '9400100000000000000000' },
        delivery_date: '2026-07-09T18:22:00Z',
        products: [
            {
                name: 'Pinnacle Shampoo',
                sku: 'PIN-100',
                inventory_items: [{ name: 'Pinnacle Shampoo', quantity: 4 }],
            },
        ],
        recipient: {
            name: 'Jane Buyer',
            email,
            address: { address1: '100 Nowhere Blvd', city: 'Gotham City', country: 'US' },
        },
    }
}

/** An OnHold shipment: status details, no tracking, and no recipient email. */
export function makeOnholdEvent(shipmentId = 107414278) {
    const event = makeShipmentEvent(shipmentId, 'OnHold', null, [
        { id: 401, name: 'InvalidAddress', description: 'Invalid Address' },
        { id: 400, name: 'PaymentDeclined', description: 'Payment Failure' },
    ])
    event.tracking = null
    event.delivery_date = null
    return event
}

/** Write an event to disk and wrap it in a trigger, the way Pandium hands one over. */
export function webhookTrigger(tmpDir, event, id, source = 'webhook') {
    const file = path.join(tmpDir, `${id}.json`)
    fs.writeFileSync(file, JSON.stringify(event))
    return { id, source, mode: source, payload: { file } }
}
