import json
import signal
from datetime import datetime, timedelta

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
    """Serves canned pages for either half and records the pages asked for.

    ``on_page`` runs before a page is served, which is where a test stands in for
    the alarm tripping or the API going away mid-query.
    """

    def __init__(self, new_pages=(), updated_pages=(), on_page=None):
        self.new_pages, self.updated_pages = list(new_pages), list(updated_pages)
        self.on_page = on_page or (lambda half, page: None)
        self.pages = {'new': [], 'updated': []}

    def _page(self, half, pages, page):
        self.pages[half].append(page)
        self.on_page(half, page)
        return pages[page - 1] if page <= len(pages) else []

    def get_new_orders_page(self, cursor, page):
        return self._page('new', self.new_pages, page)

    def get_updated_orders_page(self, cursor, page):
        return self._page('updated', self.updated_pages, page)

    def get_update_date(self, order, cursor):
        return order['shipments'][0]['last_update_at']


def ago(days):
    """A ShipBob-shaped timestamp `days` back — seven fractional digits, as the
    real API sends — inside clamp's 30-day window."""
    return (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%dT%H:%M:%S.1234567+00:00')


def _patch(monkeypatch, shipbob, gorgias):
    monkeypatch.setattr(cron, 'ShipBobAPI', lambda p: shipbob)
    monkeypatch.setattr(cron, 'GorgiasAPI', lambda p: gorgias)


def test_clamp_bounds_cursor_between_one_month_ago_and_now():
    now = datetime(2026, 7, 16, 12, 0, 0)
    assert cron.clamp('2026-07-10T00:00:00', now) == datetime(2026, 7, 10)  # in range
    assert cron.clamp('2099-01-01T00:00:00', now) == now                    # future -> now
    assert cron.clamp(None, now) == now - cron.ONE_MONTH                   # missing -> floor


def test_run_pages_until_empty_upserts_customer_and_advances_cursor(monkeypatch):
    shipbob = FakeShipBob(new_pages=[[make_order(1, ago(6), email='jane@example.com'),
                                      make_order(2, ago(5), email='jane@example.com')]])
    gorgias = recording_gorgias()
    _patch(monkeypatch, shipbob, gorgias)

    record = cron.run(make_pandium(secrets=GORGIAS_SECRETS, config={'order_start_date': ago(20)}))

    assert shipbob.pages['new'] == [1, 2]       # paged until the empty page
    assert len(gorgias.log['create']) == 1      # both orders batch onto one customer
    assert record['new_order_start_date'] == ago(5)[:26]  # advanced to the last order
    final_orders = gorgias.log['update'][-1][1]['data']['pandium']['shipbob_orders']
    assert sorted(o['id'] for o in final_orders) == [1, 2]


def test_run_advances_updated_cursor_to_oldest_update_across_pages(monkeypatch):
    """Pages are each sorted newest-first, but not relative to each other, so the
    cursor has to be the oldest update seen anywhere — not the last one processed."""
    shipbob = FakeShipBob(updated_pages=[
        [make_order(1, ago(2), email='j@x.com'), make_order(2, ago(3), email='j@x.com')],
        [make_order(3, ago(9), email='j@x.com'),   # oldest update overall
         make_order(4, ago(8), email='j@x.com')],
        [make_order(5, ago(4), email='j@x.com')],  # newer again, after the oldest page
    ])
    _patch(monkeypatch, shipbob, recording_gorgias())

    record = cron.run(make_pandium(secrets=GORGIAS_SECRETS, config={'order_start_date': ago(20)}))

    assert record['updated_order_start_date'] == ago(9)[:23]  # not order 5, the last processed


def test_timeout_flushes_the_finished_half_and_leaves_the_interrupted_one(monkeypatch, capsys):
    """The two cursors resume differently. new_order_start_date climbs per order
    over an oldest-first query, so it is sound wherever the run stops.
    updated_order_start_date is the minimum across every page, so it only holds
    once the query is exhausted — an unread page can carry an older update — and
    a run cut short flushes the value it started with."""
    start = ago(20)
    shipbob = FakeShipBob(
        new_pages=[[make_order(1, ago(6), email='j@x.com')]],
        updated_pages=[[make_order(2, ago(2), email='j@x.com')],
                       [make_order(3, ago(9), email='j@x.com')]],  # never read
        on_page=lambda half, page: signal.raise_signal(signal.SIGALRM)
        if (half, page) == ('updated', 2) else None,
    )
    _patch(monkeypatch, shipbob, recording_gorgias())

    with pytest.raises(SystemExit) as exc:
        cron.run(make_pandium(secrets=GORGIAS_SECRETS, config={'order_start_date': start}))

    assert exc.value.code == 0  # a timed-out run still succeeds, so progress merges
    flushed = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert flushed['new_order_start_date'] == ago(6)[:26]      # that half finished
    assert flushed['updated_order_start_date'] == start[:26]   # this one did not
