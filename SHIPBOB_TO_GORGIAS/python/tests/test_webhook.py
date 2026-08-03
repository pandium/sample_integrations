from datetime import datetime, timedelta, timezone

from helpers import (GORGIAS_SECRETS, make_delivered_event, make_pandium,
                     recording_gorgias, webhook_trigger)

from sb2gorgias import webhook


def _run(monkeypatch, tmp_path, triggers, metadata=None, existing=('jane@example.com',)):
    gorgias = recording_gorgias(existing_emails=existing)
    monkeypatch.setattr(webhook, 'GorgiasAPI', lambda p: gorgias)
    pandium = make_pandium(secrets=GORGIAS_SECRETS, run_triggers=triggers, metadata=metadata,
                           tmp_path=tmp_path, run_mode='webhook')
    return webhook.run(pandium), gorgias


def test_run_opens_ticket_and_writes_only_processed_shipments(monkeypatch, tmp_path):
    triggers = [webhook_trigger(tmp_path, make_delivered_event(456789), 't1')]
    result, gorgias = _run(monkeypatch, tmp_path, triggers)

    ticket = gorgias.log['ticket'][0]
    assert ticket['customer'] == {'id': 40}  # linked to the found customer
    assert ticket['tags'] == [{'name': 'shipbob-delivered'}]
    assert 'delivered on 2026-07-09 via USPS' in ticket['messages'][0]['body_text']
    assert set(result) == {'processed_shipments'}  # leaves the cron flow's cursor keys alone
    assert '456789' in result['processed_shipments']


def test_run_dedupes_within_batch_and_prunes_stale_entries(monkeypatch, tmp_path):
    now = datetime.now(timezone.utc)
    triggers = [webhook_trigger(tmp_path, make_delivered_event(456789), 't1'),
                webhook_trigger(tmp_path, make_delivered_event(456789), 't2')]  # duplicate
    metadata = {'processed_shipments': {
        '456790': now.isoformat(),                              # recent -> kept
        '999999': (now - timedelta(minutes=45)).isoformat(),    # >30 min -> pruned
    }}
    result, gorgias = _run(monkeypatch, tmp_path, triggers, metadata=metadata)

    assert len(gorgias.log['ticket']) == 1  # one ticket despite the duplicate delivery
    assert set(result['processed_shipments']) == {'456789', '456790'}


def test_run_skips_shipments_that_are_not_delivered(monkeypatch, tmp_path):
    triggers = [webhook_trigger(tmp_path, make_delivered_event(1, status='In Transit'), 't1')]
    result, gorgias = _run(monkeypatch, tmp_path, triggers)

    assert gorgias.log['ticket'] == []
    assert result['processed_shipments'] == {}
