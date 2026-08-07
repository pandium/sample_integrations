"""Gorgias API client.

The cron flow upserts customers (writing ShipBob order history to
``data.pandium.shipbob_orders``); the webhook flow creates tickets.

Auth is OAuth2 via Pandium's ``gorgias-oauth`` connector. Pandium runs the authorization
flow when the tenant connects and refreshes the token on its own schedule, so this client
never sees a client secret, never posts to a token endpoint, and holds no refresh logic —
it reads whatever access token is current for this run and sends it as a bearer token. A
refresh that fails is a platform concern and surfaces as **Failed (Refresh)** on the run,
not as an error this code has to handle.
"""

import logging
import re
from datetime import datetime
from urllib.parse import quote

import requests
from requests.adapters import HTTPAdapter, Retry

from .lib import deep_get

logger = logging.getLogger(__name__)

# Gorgias validates the shape of an email; mirror the check the older integration
# used so we agree on which recipients get an email-keyed customer.
EMAIL_RE = re.compile(
    r"([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")"
    r"@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])"
)


def _format_date(value: str) -> str:
    """Render a ShipBob ISO timestamp for the customer sidebar; pass through on
    anything unparseable. Trims to 26 chars so 7-digit fractional seconds parse."""
    if not value:
        return ''
    try:
        return datetime.fromisoformat(value[:26]).strftime('%d/%m/%Y %H:%M:%S')
    except (ValueError, TypeError):
        return value


class GorgiasAPI:
    def __init__(self, pandium):
        secrets = pandium.secrets
        token = secrets.get('gorgias_oauth_access_token')
        account = secrets.get('gorgias_oauth_account')
        if not (token and account):
            raise RuntimeError(
                'PAN_SEC_GORGIAS_OAUTH_ACCESS_TOKEN and PAN_SEC_GORGIAS_OAUTH_ACCOUNT '
                'are required'
            )

        self.api_url = f'https://{account.lower()}.gorgias.com/api'

        session = requests.Session()
        retries = Retry(
            total=6,
            backoff_factor=2,
            status_forcelist=[429, 502, 503, 504],
            allowed_methods=frozenset(['GET', 'POST', 'PUT']),
        )
        session.mount('https://', HTTPAdapter(max_retries=retries))
        # The connector reports its own scheme; every current Gorgias token is a bearer.
        token_type = secrets.get('gorgias_oauth_token_type') or 'Bearer'
        session.headers.update(
            {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': f'{token_type} {token}',
            }
        )
        self._session = session

    # --- customers (cron flow) -------------------------------------------------

    def find_customer(self, email: str = None, external_id: str = None) -> dict | None:
        """Look a customer up by email or external_id and return the detail
        record (so callers can read ``data``), or None if not found. A given
        email/external_id maps to at most one customer, so no pagination needed."""
        logger.info("looking for gorgias customer: %s, %s", email, external_id)
        if email:
            query = f'email={quote(email.lower())}'
        elif external_id:
            query = f'external_id={quote(external_id)}'
        else:
            return None

        res = self._session.get(f'{self.api_url}/customers?{query}')
        res.raise_for_status()
        rows = res.json().get('data', [])
        if not rows:
            logger.info("Customer not found")
            return None

        detail = self._session.get(f'{self.api_url}/customers/{rows[0]["id"]}')
        detail.raise_for_status()
        logger.info("Customer found")
        return detail.json()

    def create_customer(self, payload: dict):
        logger.info("creating new gorgias customer")
        res = self._session.post(f'{self.api_url}/customers', json=payload)
        try:
            res.raise_for_status()
        except Exception:
            logger.error('Create customer failed: %s', res.text)
            raise
        logger.info("Customer created successfully")
        return res.json()['id']

    def update_customer(self, customer_id, payload: dict):
        logger.info(f"updating gorgias customer {customer_id}")
        res = self._session.put(f'{self.api_url}/customers/{customer_id}', json=payload)
        try:
            res.raise_for_status()
        except Exception:
            logger.error('Update customer %s failed: %s', customer_id, res.text)
            raise
        logger.info("customer updated")

    # --- tickets (webhook flow) ---------------------------------------------------

    def create_ticket(self, payload: dict) -> dict:
        logger.info("creating gorgias ticket")
        res = self._session.post(f'{self.api_url}/tickets', json=payload)
        try:
            res.raise_for_status()
        except Exception:
            logger.error('Create ticket failed: %s', res.text)
            raise
        return res.json()

    # --- helpers ------------------------------------------------------------

    def valid_email(self, email: str) -> str:
        """Return ``email`` if Gorgias would accept it, else ''."""
        if email and '.@' not in email and EMAIL_RE.fullmatch(email):
            return email
        return ''

    def customer_key(self, sb_order: dict) -> str:
        """The key identifying an order's customer: a valid recipient email when
        present, otherwise a synthetic ``name address1 city country``."""
        email = self.valid_email(deep_get(sb_order, 'recipient.email', ''))
        if email:
            return email
        return ' '.join(
            [
                deep_get(sb_order, 'recipient.name', '') or '',
                deep_get(sb_order, 'recipient.address.address1', '') or '',
                deep_get(sb_order, 'recipient.address.city', '') or '',
                deep_get(sb_order, 'recipient.address.country', '') or '',
            ]
        )

    def new_customer_payload(self, sb_order: dict, key: str) -> dict:
        """Body for POST /customers when the customer does not yet exist."""
        payload = {
            'name': deep_get(sb_order, 'recipient.name', ''),
            'external_id': key,
            'data': {'pandium': {'shipbob_orders': []}},
        }
        email = self.valid_email(deep_get(sb_order, 'recipient.email', ''))
        if email:
            payload['email'] = email
        return payload

    def order_data_payload(self, sb_order: dict) -> dict:
        """The single order entry stored in ``data.pandium.shipbob_orders``."""
        shipments = deep_get(sb_order, 'shipments', []) or []
        for shipment in shipments:
            for field in ('estimated_fulfillment_date', 'actual_fulfillment_date'):
                if shipment.get(field):
                    shipment[field] = _format_date(shipment[field])
            shipment['url'] = (
                f"https://web.shipbob.com/App/Merchant/#/Orders/{shipment.get('id', '')}/"
            )
        return {
            'id': deep_get(sb_order, 'id', ''),
            'created_date': _format_date(deep_get(sb_order, 'created_date', '')),
            'purchase_date': _format_date(deep_get(sb_order, 'purchase_date', '')),
            'reference_id': deep_get(sb_order, 'reference_id', ''),
            'order_number': deep_get(sb_order, 'order_number', ''),
            'status': deep_get(sb_order, 'status', ''),
            'type': deep_get(sb_order, 'type', ''),
            'channel': deep_get(sb_order, 'channel', {}),
            'shipping_method': deep_get(sb_order, 'shipping_method', ''),
            'recipient': deep_get(sb_order, 'recipient', {}),
            'products': deep_get(sb_order, 'products', []),
            'tags': deep_get(sb_order, 'tags', []),
            'shipments': shipments,
        }
