"""The webhook flow: any ShipBob order webhook -> a Gorgias ticket.

ShipBob's order-related topics (``order_shipped``, ``shipment_delivered``,
``shipment_exception``, ``shipment_onhold``, ``shipment_cancelled``) all deliver the
same **shipment** object, differing only in ``status``/``status_details``. This flow
opens a ticket for every one of them, so support sees a shipment the moment it needs
attention rather than only once it lands.

Each webhook run may carry N debounced deliveries (Pandium bundles triggers that
arrive while a run is in flight), so we loop over every trigger. Creating a ticket is
not idempotent and ShipBob retries any delivery that doesn't get a 2xx, so we dedupe
on ``shipment_id:status`` using a ``processed_events`` map in tenant metadata, pruned
to a 30-minute window. Keying on the status as well as the shipment means a redelivery
is suppressed while a genuine *next* status for the same shipment still opens a ticket.

Because tenant metadata is shallow-merged at the top level, writing the whole
``processed_events`` object *replaces* the previous one (dropped keys are really
removed) while leaving the cron flow's cursor keys untouched.

Pandium verifies each delivery's signature before it ever reaches a run, so the bodies
handed to this module are already known to have come from ShipBob.
"""

import json
import logging
from datetime import datetime, timedelta, timezone

from .gorgias import GorgiasAPI
from .lib import deep_get

logger = logging.getLogger(__name__)

PRUNE_WINDOW = timedelta(minutes=30)
SHIPMENT_TAG = 'shipbob-shipment'


def _prune(processed: dict, now: datetime) -> dict:
    """Drop entries whose timestamp is more than PRUNE_WINDOW old (or unparseable)."""
    kept = {}
    for event_key, ts in processed.items():
        try:
            when = datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
            if when.tzinfo is None:
                when = when.replace(tzinfo=timezone.utc)
        except (TypeError, ValueError):
            continue  # unparseable → treat as expired
        if now - when <= PRUNE_WINDOW:
            kept[event_key] = ts
    return kept


def shipment_id(event: dict) -> str:
    """ShipBob names the shipment ``id`` on the webhook body; older docs and some
    topics call it ``shipment_id``. Accept either."""
    return str(deep_get(event, 'id', '') or deep_get(event, 'shipment_id', ''))


def _status_details(event: dict) -> str:
    """The human-readable reasons ShipBob attached to this status, e.g.
    ``Invalid Address; Payment Failure``. Empty for statuses that carry none."""
    details = deep_get(event, 'status_details', []) or []
    return '; '.join(d.get('description') or d.get('name', '') for d in details if d)


def _items(event: dict) -> str:
    """One line per product on the shipment: ``4 x 16 oz. Shampoo (PIN-100)``."""
    lines = []
    for product in deep_get(event, 'products', []) or []:
        quantity = sum(i.get('quantity') or 0 for i in product.get('inventory_items') or [])
        sku = product.get('sku') or product.get('reference_id') or ''
        lines.append(f"{quantity} x {product.get('name', '')}" + (f' ({sku})' if sku else ''))
    return '\n'.join(lines)


def build_ticket(event: dict, customer_ref: dict) -> dict:
    """Build the POST /tickets payload for a shipment webhook of any status.

    ``customer_ref`` is the ``{'id': ...}`` returned by ``resolve_customer``. Gorgias
    wants the customer twice — once as the ticket's owner and once as the sender of
    its first message — so the same reference goes in both slots.
    """
    sid = shipment_id(event)
    order_id = deep_get(event, 'order_id', '')
    reference_id = deep_get(event, 'reference_id', '') or order_id
    status = deep_get(event, 'status', 'Updated')
    reasons = _status_details(event)
    carrier = deep_get(event, 'tracking.carrier', '')
    tracking_number = deep_get(event, 'tracking.tracking_number', '')
    delivered_on = (deep_get(event, 'delivery_date', '') or '')[:10]  # YYYY-MM-DD

    headline = f'Shipment {sid} for order {reference_id} is now {status}.'

    # Only the parts ShipBob actually sent for this status make it into the body —
    # an OnHold shipment has no tracking, a Delivered one has no status details.
    lines = [headline]
    if reasons:
        lines.append(f'Reason: {reasons}')
    if carrier or tracking_number:
        lines.append(f'Tracking: {carrier} {tracking_number}'.strip())
    if delivered_on:
        lines.append(f'Delivered on: {delivered_on}')
    items = _items(event)
    if items:
        lines.append(f'Items:\n{items}')
    body_text = '\n'.join(lines)

    html = [f'<p>{headline}</p>']
    if reasons:
        html.append(f'<p><b>Reason:</b> {reasons}</p>')
    if carrier or tracking_number:
        html.append(f'<p><b>Tracking:</b> {carrier} {tracking_number}</p>')
    if items:
        html.append('<ul>' + ''.join(f'<li>{line}</li>' for line in items.split('\n')) + '</ul>')

    message = {
        'sender': customer_ref,
        'channel': 'api',
        'via': 'api',
        'from_agent': False,
        'subject': f'Order {reference_id}: shipment {status}',
        'body_text': body_text,
        'body_html': ''.join(html),
        # Included so Gorgias auto-reply / keyword rules can fire.
        'stripped_text': headline,
    }
    return {
        'customer': customer_ref,
        'channel': 'api',
        'via': 'api',
        'from_agent': False,
        'status': 'open',
        'messages': [message],
        # A constant tag to find every ticket this flow opened, plus the status so
        # Gorgias rules can route (e.g. OnHold) without parsing the body.
        'tags': [{'name': SHIPMENT_TAG}, {'name': f"shipbob-{str(status).lower().replace(' ', '-')}"}],
    }


def resolve_customer(gorgias: GorgiasAPI, event: dict) -> dict:
    """Find-or-create the Gorgias customer for a shipment's recipient and return the
    reference to attach the ticket to.

    Uses the same key the cron flow does — a valid recipient email when there is one,
    otherwise the synthetic ``name address1 city country`` external_id — so a webhook
    ticket lands on the same record that carries the customer's order history. A
    recipient email is optional on a ShipBob shipment, so the external_id path carries
    as much weight here as it does in the cron flow.
    """
    email = gorgias.valid_email(deep_get(event, 'recipient.email', ''))
    key = gorgias.customer_key(event)

    existing = gorgias.find_customer(email=email or None, external_id=None if email else key)
    if existing:
        return {'id': existing['id']}
    return {'id': gorgias.create_customer(gorgias.new_customer_payload(event, key))}


def run(pandium) -> dict:
    now = datetime.now(timezone.utc)
    metadata = pandium.metadata or {}
    processed = _prune(metadata.get('processed_events') or {}, now)

    gorgias = GorgiasAPI(pandium)
    now_iso = now.isoformat()
    created = 0

    # Pandium bundles debounced deliveries into one run; lib.Pandium reads each raw body
    # back off disk so this loop only has to deal with the event itself.
    for delivery in pandium.webhook_deliveries():
        try:
            event = json.loads(delivery.body)
        except json.JSONDecodeError as err:
            logger.error('Webhook delivery %s is not valid JSON: %s', delivery.id, err)
            continue

        sid = shipment_id(event)
        if not sid:
            logger.warning('Webhook delivery %s has no shipment id; skipping.', delivery.id)
            continue

        # Every order webhook gets a ticket, whatever the status — the status is only
        # part of the dedupe key, never a filter.
        status = deep_get(event, 'status', 'Updated')
        event_key = f'{sid}:{status}'
        if event_key in processed:
            logger.info('Shipment %s is already ticketed as %s; skipping duplicate.', sid, status)
            continue

        try:
            customer_ref = resolve_customer(gorgias, event)
        except Exception as err:
            logger.error('Could not resolve a Gorgias customer for shipment %s: %s', sid, err)
            continue  # leave unprocessed so ShipBob's retry can try again

        try:
            ticket = gorgias.create_ticket(build_ticket(event, customer_ref))
        except Exception as err:
            logger.error('Failed to open ticket for shipment %s: %s', sid, err)
            continue  # leave unprocessed so ShipBob's retry can try again

        processed[event_key] = now_iso  # mark handled
        created += 1
        logger.info('Opened Gorgias ticket %s for shipment %s (%s).', ticket.get('id'), sid, status)

    logger.info('Webhook flow: opened %d ticket(s); tracking %d event(s).', created, len(processed))
    # Replaces the map (30-min pruned); shallow merge leaves the cron flow's cursor keys intact.
    return {'processed_events': processed}
