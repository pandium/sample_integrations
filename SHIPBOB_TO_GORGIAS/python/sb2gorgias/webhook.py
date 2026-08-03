"""The webhook flow: ShipBob ``shipment_delivered`` -> Gorgias ticket.

Each webhook run may carry N debounced deliveries (Pandium bundles triggers that
arrive while a run is in flight), so we loop over every trigger. Creating a ticket
is not idempotent and ShipBob retries any delivery that doesn't get a 2xx, so we
dedupe on ``shipment_id`` using a ``processed_shipments`` map in tenant metadata,
pruned to a 30-minute window.

Because tenant metadata is shallow-merged at the top level, writing the whole
``processed_shipments`` object *replaces* the previous one (dropped keys are
really removed) while leaving the cron flow's cursor keys untouched.

Pandium verifies each delivery's signature before it ever reaches a run, so the
bodies handed to this module are already known to have come from ShipBob.
"""

import json
import logging
from datetime import datetime, timedelta, timezone

from .gorgias import GorgiasAPI
from .lib import deep_get

logger = logging.getLogger(__name__)

PRUNE_WINDOW = timedelta(minutes=30)
DELIVERED_TAG = 'shipbob-delivered'


def _prune(processed: dict, now: datetime) -> dict:
    """Drop entries whose timestamp is more than PRUNE_WINDOW old (or unparseable)."""
    kept = {}
    for shipment_id, ts in processed.items():
        try:
            when = datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
            if when.tzinfo is None:
                when = when.replace(tzinfo=timezone.utc)
        except (TypeError, ValueError):
            continue  # unparseable → treat as expired
        if now - when <= PRUNE_WINDOW:
            kept[shipment_id] = ts
    return kept


def build_ticket(event: dict, customer: dict | None) -> dict:
    """Build the POST /tickets payload for a delivered shipment."""
    email = deep_get(event, 'recipient.email', '')
    shipment_id = deep_get(event, 'shipment_id', '')
    reference_id = deep_get(event, 'reference_id', '') or deep_get(event, 'order_id', '')
    carrier = deep_get(event, 'tracking.carrier', '')
    tracking_number = deep_get(event, 'tracking.tracking_number', '')
    delivered_on = (deep_get(event, 'delivery_date', '') or '')[:10]  # YYYY-MM-DD

    # Link to the existing Gorgias customer when we found one, else let Gorgias
    # resolve/create by email.
    customer_ref = {'id': customer['id']} if customer else {'email': email}

    message = {
        'sender': {'email': email},
        'channel': 'api',
        'via': 'api',
        'from_agent': False,
        'subject': f'Order {reference_id} delivered',
        'body_text': (
            f'Shipment {shipment_id} for order {reference_id} was delivered on '
            f'{delivered_on} via {carrier} ({tracking_number}).'
        ),
        'body_html': (
            f'<p>Shipment {shipment_id} for order <b>{reference_id}</b> was '
            f'delivered on {delivered_on} via {carrier}.</p>'
        ),
        # Included so Gorgias auto-reply / keyword rules can fire.
        'stripped_text': f'Shipment {shipment_id} for order {reference_id} was delivered.',
    }
    return {
        'customer': customer_ref,
        'channel': 'api',
        'via': 'api',
        'from_agent': False,
        'status': 'open',
        'messages': [message],
        'tags': [{'name': DELIVERED_TAG}],
    }


def run(pandium) -> dict:
    now = datetime.now(timezone.utc)
    metadata = pandium.metadata or {}
    processed = _prune(metadata.get('processed_shipments') or {}, now)

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

        if event.get('status') != 'Delivered':
            logger.info('Ignoring webhook with status %r.', event.get('status'))
            continue

        shipment_id = str(deep_get(event, 'shipment_id', ''))
        if not shipment_id:
            logger.warning('Delivered webhook has no shipment_id; skipping.')
            continue
        if shipment_id in processed:
            logger.info('Shipment %s already handled; skipping duplicate.', shipment_id)
            continue

        email = deep_get(event, 'recipient.email', '')
        if not email:
            logger.warning('Shipment %s has no recipient email; cannot open a ticket.', shipment_id)
            continue

        try:
            customer = gorgias.find_customer(email=email)
        except Exception as err:
            logger.warning('Could not look up customer %s (%s); creating ticket by email.', email, err)
            customer = None

        try:
            ticket = gorgias.create_ticket(build_ticket(event, customer))
        except Exception as err:
            logger.error('Failed to open ticket for shipment %s: %s', shipment_id, err)
            continue  # leave unprocessed so ShipBob's retry can try again

        processed[shipment_id] = now_iso  # mark handled
        created += 1
        logger.info('Opened Gorgias ticket %s for shipment %s.', ticket.get('id'), shipment_id)

    logger.info('Webhook flow: opened %d ticket(s); tracking %d shipment(s).', created, len(processed))
    # Replaces the map (30-min pruned); shallow merge leaves the cron flow's cursor keys intact.
    return {'processed_shipments': processed}
