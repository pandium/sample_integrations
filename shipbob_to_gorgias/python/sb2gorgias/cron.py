"""The cron flow: ShipBob orders -> Gorgias customer sidebar.

Keeps each Gorgias customer's ``data.pandium.shipbob_orders`` in sync with that
customer's recent ShipBob orders. Runs on a schedule and resumes where the last
run left off, using tenant metadata as the cursor.

The run is bounded at ~10 minutes by Pandium. To stay resumable, the loop keeps a
single in-memory *timeout record* (the cursor) current as each order is
processed, and a SIGALRM handler writes that record before the hard kill. Exiting
0 on timeout means the partial cursor is merged into metadata and the next run
picks up from there.

The two cursors resume differently. ``new_order_start_date`` climbs per order
over an oldest-first query, so it is sound wherever the run stops.
``updated_order_start_date`` is the minimum across every page, so it only holds
once the query is exhausted — an unread page can carry an older update — and a
run cut short leaves it where it started. Re-syncing what it covers again is
harmless: customer writes are idempotent PUTs.

"""

import logging
import signal
import sys
from datetime import datetime, timedelta

from .gorgias import GorgiasAPI
from .lib import deep_get
from .shipbob import ShipBobAPI

logger = logging.getLogger(__name__)

ALARM_SECONDS = 540  # self-imposed 9-min alarm, ahead of Pandium's ~10-min kill
ONE_MONTH = timedelta(days=30)
MAX_ORDERS_TO_SYNC = 10  # most recent N orders kept on each customer


def clamp(value, now: datetime) -> datetime:
    """Keep a cursor within [now - 1 month, now]. Unparseable/missing values fall
    back to one month ago (the oldest window we ever fetch)."""
    floor = now - ONE_MONTH
    try:
        dt = value if isinstance(value, datetime) else datetime.fromisoformat(str(value))
    except (TypeError, ValueError):
        return floor
    if dt.tzinfo is not None:
        dt = dt.replace(tzinfo=None)  # compare naive-to-naive
    return min(max(dt, floor), now)


def _upsert(orders: list, order_payload: dict, newest_first: bool) -> list:
    """Merge ``order_payload`` into a customer's order list (replace by id, else
    append), then sort and trim to the most recent ``MAX_ORDERS_TO_SYNC``."""
    for i, existing in enumerate(orders):
        if existing.get('id') == order_payload['id']:
            orders[i] = order_payload
            return orders  # in-place replace; no re-sort/trim needed

    orders.append(order_payload)
    orders.sort(key=lambda o: o.get('id', 0), reverse=newest_first)
    if len(orders) > MAX_ORDERS_TO_SYNC:
        orders = orders[:MAX_ORDERS_TO_SYNC] if newest_first else orders[-MAX_ORDERS_TO_SYNC:]
    return orders


def process_order(sb_order: dict, gorgias: GorgiasAPI, cache: dict, newest_first: bool) -> None:
    """Find-or-create the order's Gorgias customer, then PUT/POST its updated
    ``data.pandium.shipbob_orders``. ``cache`` accumulates customer payloads
    within a run so multiple orders for one customer batch onto the same record.
    """
    key = gorgias.customer_key(sb_order)
    email = gorgias.valid_email(deep_get(sb_order, 'recipient.email', ''))

    if key not in cache:
        try:
            existing = gorgias.find_customer(
                email=email or None, external_id=None if email else key
            )
        except Exception as err:
            logger.error('Skipping order %s — cannot fetch customer %s: %s',
                         deep_get(sb_order, 'id', ''), key, err)
            return

        if existing:
            # Anything already under data.pandium came from outside this
            # integration — a hand-edited customer can carry {"pandium": null} —
            # so check the type at every level rather than just the leaf.
            data = existing.get('data') or {}
            pandium = data.get('pandium')
            if not isinstance(pandium, dict):
                pandium = {}
            if not isinstance(pandium.get('shipbob_orders'), list):
                pandium['shipbob_orders'] = []
            data['pandium'] = pandium
            cache[key] = {'id': existing['id'], 'data': data}
        else:
            cache[key] = gorgias.new_customer_payload(sb_order, key)

    customer = cache[key]
    customer['data']['pandium']['shipbob_orders'] = _upsert(
        customer['data']['pandium']['shipbob_orders'],
        gorgias.order_data_payload(sb_order),
        newest_first,
    )

    try:
        if 'id' in customer:
            gorgias.update_customer(customer['id'], customer)
        else:
            customer['id'] = gorgias.create_customer(customer)
    except Exception as err:
        logger.error('Failed to upsert Gorgias customer %s: %s', key, err)


def run(pandium) -> dict:
    now = datetime.now()
    metadata = pandium.metadata or {}
    fallback = pandium.config.get('order_start_date')

    new_cursor = clamp(metadata.get('new_order_start_date') or fallback, now)
    updated_cursor = clamp(metadata.get('updated_order_start_date') or fallback, now)

    # The timeout record: the cursor written on either outcome. Values are ISO
    # strings advanced as orders are processed.
    record = {
        'new_order_start_date': new_cursor.isoformat(),
        'updated_order_start_date': updated_cursor.isoformat(),
    }

    def on_alarm(signum, frame):
        logger.warning('Approaching the run-time limit — flushing cursor for the next run.')
        # Same writer the normal path uses, so there is exactly one route to stdout.
        pandium.update_metadata(record)
        sys.exit(0)  # timed-out run still counts as successful → partial cursor merged

    signal.signal(signal.SIGALRM, on_alarm)
    signal.alarm(ALARM_SECONDS)

    shipbob = ShipBobAPI(pandium)
    gorgias = GorgiasAPI(pandium)
    newest_first = str(pandium.config.get('newest_order_first', '')).lower() == 'true'
    cache: dict = {}

    # New orders: SortOrder=Oldest, so created_date advances forward monotonically.
    logger.info('Syncing new ShipBob orders since %s', record['new_order_start_date'])
    page = 1
    while True:
        orders = shipbob.get_new_orders_page(new_cursor, page)
        if not orders:
            break
        for order in orders:
            logger.info('Processing new order with id %s', order["id"])
            process_order(order, gorgias, cache, newest_first)
            created = order.get('created_date')
            if created:
                # created_date is YYYY-MM-DDThh:mm:ss.sssssss+00:00; trim to 26
                # chars for a valid (naive, microsecond) date-time.
                record['new_order_start_date'] = created[:26]
        page += 1

    # Updated orders: keyed off shipment last_update_at (see get_updated_orders_page).
    logger.info('Syncing updated ShipBob orders since %s', record['updated_order_start_date'])
    page = 1
    # Each page is sorted newest-first, but pages are not sorted relative to each
    # other, so the cursor is the minimum across every processed order — not
    # whatever the last order of the last page happened to carry. Kept out of the
    # record until the loop ends: every update date is, by construction, later
    # than the starting cursor, so folding that in would pin the cursor there
    # forever, and a partial minimum would sit newer than the pages still unread.
    oldest_update = None
    while True:
        orders = shipbob.get_updated_orders_page(updated_cursor, page)
        if not orders:
            break
        for order in orders:
            logger.info('Processing updated order with id %s', order["id"])
            process_order(order, gorgias, cache, newest_first)
            # last_update_at is YYYY-MM-DDThh:mm:ss.sss+00:00; trim to 23 chars.
            # Uniform width and format, so a string compare orders them correctly.
            update_date = shipbob.get_update_date(order, updated_cursor)[:23]
            if oldest_update is None or update_date < oldest_update:
                oldest_update = update_date
        page += 1

    # Every page is in, so the minimum is final and safe to resume from.
    if oldest_update is not None:
        record['updated_order_start_date'] = oldest_update

    signal.alarm(0)  # made it — cancel the alarm; __main__ prints the record on return
    return record
