import json
import signal
from datetime import datetime

import pytest
from helpers import GORGIAS_SECRETS, make_order, make_pandium, recording_gorgias

from sb2gorgias import cron


@pytest.fixture(autouse=True)
def _cancel_alarms():
    # cron.run arms a 9-min SIGALRM; don't let it leak into other tests.
    yield
    signal.alarm(0)
    signal.signal(signal.SIGALRM, signal.SIG_DFL)


class FakeShipBob:
    """Serves canned pages of new orders (no updated orders); records page numbers."""

    def __init__(self, new_pages):
        self.new_pages = new_pages
        self.pages = []

    def get_new_orders_page(self, cursor, page):
        self.pages.append(page)
        return self.new_pages[page - 1] if page <= len(self.new_pages) else []

    def get_updated_orders_page(self, cursor, page):
        return []

    def get_update_date(self, order, cursor):
        return order['shipments'][0]['last_update_at']


def _patch(monkeypatch, shipbob, gorgias):
    monkeypatch.setattr(cron, 'ShipBobAPI', lambda p: shipbob)
    monkeypatch.setattr(cron, 'GorgiasAPI', lambda p: gorgias)


def test_clamp_bounds_cursor_between_one_month_ago_and_now():
    now = datetime(2026, 7, 16, 12, 0, 0)
    assert cron.clamp('2026-07-10T00:00:00', now) == datetime(2026, 7, 10)  # in range
    assert cron.clamp('2099-01-01T00:00:00', now) == now                    # future -> now
    assert cron.clamp(None, now) == now - cron.ONE_MONTH                   # missing -> floor


def test_run_pages_until_empty_upserts_customer_and_advances_cursor(monkeypatch):
    pages = [[make_order(1, '2026-07-05T10:00:00.1234567+00:00', email='jane@example.com'),
              make_order(2, '2026-07-06T10:00:00.1234567+00:00', email='jane@example.com')]]
    shipbob, gorgias = FakeShipBob(pages), recording_gorgias()
    _patch(monkeypatch, shipbob, gorgias)

    record = cron.run(make_pandium(secrets=GORGIAS_SECRETS, config={'order_start_date': '2026-07-01'}))

    assert shipbob.pages == [1, 2]                    # paged until the empty page
    assert len(gorgias.log['create']) == 1            # both orders batch onto one customer
    assert record['new_order_start_date'] == '2026-07-06T10:00:00.123456'  # advanced to last order
    final_orders = gorgias.log['update'][-1][1]['data']['pandium']['shipbob_orders']
    assert sorted(o['id'] for o in final_orders) == [1, 2]


def test_run_flushes_partial_cursor_and_exits_zero_on_timeout(monkeypatch, capsys):
    class Alarming(FakeShipBob):
        def get_new_orders_page(self, cursor, page):
            if page == 1:
                return [make_order(1, '2026-07-05T10:00:00.1234567+00:00', email='j@x.com')]
            signal.raise_signal(signal.SIGALRM)  # trip the alarm before page 2 is processed
            return [make_order(2, '2026-07-06T10:00:00.1234567+00:00', email='j@x.com')]

    _patch(monkeypatch, Alarming([]), recording_gorgias())

    with pytest.raises(SystemExit) as exc:
        cron.run(make_pandium(secrets=GORGIAS_SECRETS, config={'order_start_date': '2026-07-01'}))

    assert exc.value.code == 0  # timed-out run still succeeds so progress is merged
    flushed = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert flushed['new_order_start_date'] == '2026-07-05T10:00:00.123456'  # only order 1 processed
