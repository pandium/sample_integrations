import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterEach, beforeEach, test } from 'node:test'

import * as webhook from '../src/webhook.js'
import {
    GORGIAS_SECRETS,
    makeOnholdEvent,
    makePandium,
    makeShipmentEvent,
    recordingGorgias,
    webhookTrigger,
} from './helpers.js'

let tmpDir: string

beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb2g-'))
})

afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
})

async function run(triggers: any[], opts: { metadata?: any; existing?: string[] } = {}) {
    const gorgias = recordingGorgias(opts.existing ?? ['jane@example.com'])
    const pandium = makePandium({
        secrets: GORGIAS_SECRETS,
        runTriggers: triggers,
        metadata: opts.metadata,
        tmpDir,
        runMode: 'webhook',
    })
    const result = await webhook.run(pandium, { gorgias })
    return { result, gorgias }
}

test('run opens a ticket and returns only processed_events', async () => {
    const triggers = [webhookTrigger(tmpDir, makeShipmentEvent(456789), 't1')]
    const { result, gorgias } = await run(triggers)

    const ticket = gorgias.log.ticket[0]
    assert.deepEqual(ticket.customer, { id: 40 }) // linked to the found customer
    assert.deepEqual(ticket.tags, [{ name: 'shipbob-shipment' }, { name: 'shipbob-delivered' }])
    assert.match(ticket.messages[0].body_text, /is now Delivered/)
    assert.match(ticket.messages[0].body_text, /USPS 9400100000000000000000/)
    assert.deepEqual(Object.keys(result), ['processed_events']) // leaves cron's cursor keys alone
    assert.ok('456789:Delivered' in result.processed_events)
})

test('run dedupes duplicate deliveries within a batch and prunes stale processed_events', async () => {
    const now = new Date()
    const triggers = [
        webhookTrigger(tmpDir, makeShipmentEvent(456789), 't1'),
        webhookTrigger(tmpDir, makeShipmentEvent(456789), 't2'), // duplicate
    ]
    const metadata = {
        processed_events: {
            '456790:Delivered': now.toISOString(), // recent -> kept
            '999999:Delivered': new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // >30 min -> pruned
        },
    }
    const { result, gorgias } = await run(triggers, { metadata })

    assert.equal(gorgias.log.ticket.length, 1) // one ticket despite the duplicate delivery
    assert.deepEqual(
        new Set(Object.keys(result.processed_events)),
        new Set(['456789:Delivered', '456790:Delivered'])
    )
})

test('run tickets every distinct shipment+status once, even redeliveries of the same status', async () => {
    const triggers = [
        webhookTrigger(tmpDir, makeShipmentEvent(1, 'OnHold'), 't1'),
        webhookTrigger(tmpDir, makeShipmentEvent(1, 'OnHold'), 't2'),
        webhookTrigger(tmpDir, makeShipmentEvent(1, 'Delivered'), 't3'),
    ]
    const { result, gorgias } = await run(triggers)

    assert.equal(gorgias.log.ticket.length, 2)
    assert.deepEqual(new Set(Object.keys(result.processed_events)), new Set(['1:OnHold', '1:Delivered']))
})

test('run creates the customer by external_id when the recipient has no email, and formats OnHold body correctly', async () => {
    const triggers = [webhookTrigger(tmpDir, makeOnholdEvent(), 't1')]
    const { result, gorgias } = await run(triggers)

    const created = gorgias.log.create[0]
    assert.ok(!('email' in created))
    // the synthetic key the cron flow uses too: name address1 city country
    assert.equal(created.external_id, 'Jane Buyer 100 Nowhere Blvd Gotham City US')

    const ticket = gorgias.log.ticket[0]
    assert.deepEqual(ticket.customer, { id: 1001 }) // the customer we just created
    const body = ticket.messages[0].body_text
    assert.match(body, /is now OnHold/)
    assert.match(body, /Reason: Invalid Address; Payment Failure/)
    assert.doesNotMatch(body, /Tracking:/) // OnHold shipments carry none
    assert.match(body, /4 x Pinnacle Shampoo \(PIN-100\)/)
    assert.deepEqual(Object.keys(result.processed_events), ['107414278:OnHold'])
})
