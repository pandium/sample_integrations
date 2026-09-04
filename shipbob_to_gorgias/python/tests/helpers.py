"""Shared test doubles and factories — nothing here touches the network."""

import json

from sb2gorgias.gorgias import GorgiasAPI
from sb2gorgias.lib import Pandium

GORGIAS_SECRETS = {
    'gorgias_oauth_access_token': 'gorgias-token-123',
    'gorgias_oauth_account': 'acme',
}


def make_pandium(config=None, secrets=None, run_triggers=None, metadata=None,
                 run_mode=None, tmp_path=None):
    """Build a Pandium directly (no env). ``metadata`` is written to a temp file
    so ``pandium.metadata`` reads it back like the real thing."""
    context = {}
    if run_mode is not None:
        context['run_mode'] = run_mode
    if run_triggers is not None:
        context['run_triggers'] = json.dumps(run_triggers)
    if metadata is not None:
        path = tmp_path / 'metadata.json'
        path.write_text(json.dumps(metadata))
        context['tenant_metadata_file'] = str(path)
    return Pandium(config=config or {}, secrets=secrets or {}, context=context)


def recording_gorgias(existing_emails=()):
    """A real GorgiasAPI (so helper logic runs) with HTTP methods replaced by
    in-memory recorders. ``existing_emails`` are pre-seeded as found customers;
    inspect ``api.log`` in assertions."""
    api = GorgiasAPI(make_pandium(secrets=GORGIAS_SECRETS))
    store = {email: 40 + i for i, email in enumerate(existing_emails)}
    log = {'create': [], 'update': [], 'ticket': []}

    def find_customer(email=None, external_id=None):
        key = email or external_id
        return {'id': store[key], 'data': {'pandium': {'shipbob_orders': []}}} if key in store else None

    def create_customer(payload):
        cid = 1000 + len(store)
        store[payload.get('external_id', cid)] = cid
        log['create'].append(payload)
        return cid

    def update_customer(cust_id, payload):
        log['update'].append((cust_id, json.loads(json.dumps(payload))))  # snapshot

    def create_ticket(payload):
        log['ticket'].append(payload)
        return {'id': 900 + len(log['ticket'])}

    api.find_customer, api.create_customer = find_customer, create_customer
    api.update_customer, api.create_ticket = update_customer, create_ticket
    api.log = log
    return api


def make_order(oid, created, email=None, last_update=None):
    return {
        'id': oid, 'created_date': created, 'reference_id': f'REF-{oid}',
        'recipient': {'email': email, 'name': 'Buyer',
                      'address': {'address1': '1 Main St', 'city': 'NY', 'country': 'US'}},
        'shipments': [{'id': oid * 10, 'last_update_at': last_update or created}],
    }


def make_shipment_event(shipment_id=456789, status='Delivered', email='jane@example.com',
                        status_details=None):
    """A ShipBob shipment webhook body. Every order-related topic delivers this same
    object; ``status`` and ``status_details`` are what vary between them."""
    return {
        'id': shipment_id, 'order_id': 289012345, 'reference_id': 'MERCHANT-ORDER-1001',
        'status': status, 'status_details': status_details or [],
        'tracking': {'carrier': 'USPS', 'tracking_number': '9400100000000000000000'},
        'delivery_date': '2026-07-09T18:22:00Z',
        'products': [{'name': 'Pinnacle Shampoo', 'sku': 'PIN-100',
                      'inventory_items': [{'name': 'Pinnacle Shampoo', 'quantity': 4}]}],
        'recipient': {'name': 'Jane Buyer', 'email': email,
                      'address': {'address1': '100 Nowhere Blvd', 'city': 'Gotham City',
                                  'country': 'US'}},
    }


def make_onhold_event(shipment_id=107414278):
    """An OnHold shipment: status details, no tracking, and no recipient email."""
    event = make_shipment_event(
        shipment_id, status='OnHold', email=None,
        status_details=[{'id': 401, 'name': 'InvalidAddress', 'description': 'Invalid Address'},
                        {'id': 400, 'name': 'PaymentDeclined', 'description': 'Payment Failure'}],
    )
    event['tracking'] = None
    event['delivery_date'] = None
    return event


def webhook_trigger(tmp_path, event, tid, source='webhook'):
    """Write an event to disk and wrap it in a trigger, the way Pandium hands one over."""
    path = tmp_path / f'{tid}.json'
    path.write_text(json.dumps(event))
    return {'id': tid, 'source': source, 'payload': {'file': str(path)}}
