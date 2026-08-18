"""ShipBob API client — reads orders for the cron sync.

Auth is a single bearer token (``PAN_SEC_SHIPBOB_ACCESS_TOKEN``). The base URL is
resolved from the token's issuer (``iss``) claim, so the same code targets prod,
sandbox, or QA depending on which token the tenant connected.
"""

import base64
import json
import logging
from datetime import datetime

import requests
from requests.adapters import HTTPAdapter, Retry

logger = logging.getLogger(__name__)

# ShipBob issues tokens from different auth hosts per environment; map each to its
# matching API base URL. Anything unrecognized falls back to prod.
AUTH_URL_TO_BASE_URL = {
    'https://authstage.shipbob.com': 'https://sandbox-api.shipbob.com/2026-01',
    'https://auth.shipbob.com': 'https://api.shipbob.com/2026-01',
}
DEFAULT_BASE_URL = 'https://api.shipbob.com/2026-01'


def _resolve_base_url(token: str) -> str:
    """Decode the JWT payload and map its ``iss`` claim to an API base URL."""
    try:
        payload = token.split('.')[1]
        payload += '=' * (-len(payload) % 4)  # restore base64 padding
        claims = json.loads(base64.urlsafe_b64decode(payload))
        return AUTH_URL_TO_BASE_URL.get(claims.get('iss'), DEFAULT_BASE_URL)
    except Exception as err:  # malformed token → assume prod
        logger.warning('Could not resolve ShipBob base URL from token: %s', err)
        return DEFAULT_BASE_URL


class ShipBobAPI:
    def __init__(self, pandium):
        token = pandium.secrets.get('shipbob_access_token')
        if not token:
            raise RuntimeError('PAN_SEC_SHIPBOB_ACCESS_TOKEN is required')

        self.api_url = _resolve_base_url(token)

        session = requests.Session()
        retries = Retry(total=6, backoff_factor=3, status_forcelist=[429, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))
        session.headers.update(
            {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': f'Bearer {token}',
            }
        )
        self._session = session

    def _get_orders(self, params: dict) -> list:
        """GET one page of ``/order``. Returns [] on error or empty page."""
        res = self._session.get(f'{self.api_url}/order', params=params)
        try:
            res.raise_for_status()
        except Exception as err:
            logger.error('ShipBob order fetch failed (%s): %s', params, err)
            return []
        data = res.json()
        return data if isinstance(data, list) else []

    def get_new_orders_page(self, start_date: datetime, page: int) -> list:
        """One page of orders created since ``start_date``, oldest first."""
        return self._get_orders(
            {'StartDate': start_date.isoformat(), 'Page': page, 'SortOrder': 'Oldest'}
        )

    def get_updated_orders_page(self, start_date: datetime, page: int) -> list:
        """One page of orders updated since ``start_date``.

        ShipBob puts ``last_update_at`` on shipments, not orders, so we derive a
        per-order update timestamp and sort the page newest-first. Advancing the
        cursor to the oldest processed update keeps the sync conservative: a
        timed-out run never skips an update, at the cost of some reprocessing
        (which is harmless — customer writes are idempotent PUTs).
        """
        orders = self._get_orders({'LastUpdateStartDate': start_date.isoformat(), 'Page': page})
        orders.sort(key=lambda order: self.get_update_date(order, start_date), reverse=True)
        return orders

    def get_update_date(self, order: dict, start_date: datetime) -> str:
        """The oldest shipment ``last_update_at`` on ``order`` that still falls
        after ``start_date``; defaults to now when none qualify."""
        start_str = start_date.strftime('%Y-%m-%dT%H:%M:%S.%f')
        update_date = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')
        for shipment in order.get('shipments', []) or []:
            ts = shipment.get('last_update_at')
            if ts and start_str < ts < update_date:
                update_date = ts
        return update_date
