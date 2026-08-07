from datetime import datetime, timedelta, timezone

from helpers import (GORGIAS_SECRETS, make_onhold_event, make_pandium,
                     make_shipment_event, recording_gorgias, webhook_trigger)

from sb2gorgias import webhook


def _run(monkeypatch, tmp_path, triggers, metadata=None, existing=('jane@example.com',)):
    gorgias = recording_gorgias(existing_emails=existing)
    monkeypatch.setattr(webhook, 'GorgiasAPI', lambda p: gorgias)
    pandium = make_pandium(secrets=GORGIAS_SECRETS, run_triggers=triggers, metadata=metadata,
                           tmp_path=tmp_path, run_mode='webhook')
    return webhook.run(pandium), gorgias


def test_run_opens_ticket_and_writes_only_processed_events(monkeypatch, tmp_path):
    triggers = [webhook_trigger(tmp_path, make_shipment_event(456789), 't1')]
    result, gorgias = _run(monkeypatch, tmp_path, triggers)

    ticket = gorgias.log['ticket'][0]
    assert ticket['customer'] == {'id': 40}  # linked to the found customer
    assert ticket['tags'] == [{'name': 'shipbob-shipment'}, {'name': 'shipbob-delivered'}]
    assert 'is now Delivered' in ticket['messages'][0]['body_text']
    assert 'USPS 9400100000000000000000' in ticket['messages'][0]['body_text']
    assert set(result) == {'processed_events'}  # leaves the cron flow's cursor keys alone
    assert '456789:Delivered' in result['processed_events']


def test_run_dedupes_within_batch_and_prunes_stale_entries(monkeypatch, tmp_path):
    now = datetime.now(timezone.utc)
    triggers = [webhook_trigger(tmp_path, make_shipment_event(456789), 't1'),
                webhook_trigger(tmp_path, make_shipment_event(456789), 't2')]  # duplicate
    metadata = {'processed_events': {
        '456790:Delivered': now.isoformat(),                            # recent -> kept
        '999999:Delivered': (now - timedelta(minutes=45)).isoformat(),  # >30 min -> pruned
    }}
    result, gorgias = _run(monkeypatch, tmp_path, triggers, metadata=metadata)

    assert len(gorgias.log['ticket']) == 1  # one ticket despite the duplicate delivery
    assert set(result['processed_events']) == {'456789:Delivered', '456790:Delivered'}


def test_run_tickets_every_status_but_not_the_same_one_twice(monkeypatch, tmp_path):
    """Dedupe is per shipment *and* status: a redelivery is dropped, a genuine next
    status for the same shipment still opens its own ticket."""
    triggers = [webhook_trigger(tmp_path, make_shipment_event(1, status='OnHold'), 't1'),
                webhook_trigger(tmp_path, make_shipment_event(1, status='OnHold'), 't2'),
                webhook_trigger(tmp_path, make_shipment_event(1, status='Delivered'), 't3')]
    result, gorgias = _run(monkeypatch, tmp_path, triggers)

    assert len(gorgias.log['ticket']) == 2
    assert set(result['processed_events']) == {'1:OnHold', '1:Delivered'}


def test_run_creates_customer_by_external_id_when_recipient_has_no_email(monkeypatch, tmp_path):
    triggers = [webhook_trigger(tmp_path, make_onhold_event(), 't1')]
    result, gorgias = _run(monkeypatch, tmp_path, triggers)

    created = gorgias.log['create'][0]
    assert 'email' not in created
    # the synthetic key the cron flow uses too: name address1 city country
    assert created['external_id'] == 'Jane Buyer 100 Nowhere Blvd Gotham City US'

    ticket = gorgias.log['ticket'][0]
    assert ticket['customer'] == {'id': 1001}  # the customer we just created
    body = ticket['messages'][0]['body_text']
    assert 'is now OnHold' in body
    assert 'Reason: Invalid Address; Payment Failure' in body
    assert 'Tracking:' not in body  # OnHold shipments carry none
    assert '4 x Pinnacle Shampoo (PIN-100)' in body
    assert set(result['processed_events']) == {'107414278:OnHold'}
