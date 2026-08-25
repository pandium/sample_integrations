import base64
import json
from datetime import datetime

import pytest
import requests
from helpers import GORGIAS_SECRETS, make_order, make_pandium

from sb2gorgias.gorgias import GorgiasAPI
from sb2gorgias.shipbob import DEFAULT_BASE_URL, ShipBobAPI, _resolve_base_url


def _token(iss):
    payload = base64.urlsafe_b64encode(json.dumps({'iss': iss}).encode()).rstrip(b'=').decode()
    return f'header.{payload}.sig'


def test_shipbob_base_url_resolved_from_token_issuer():
    assert _resolve_base_url(_token('https://authstage.shipbob.com')) == 'https://sandbox-api.shipbob.com/2026-01'
    assert _resolve_base_url(_token('https://auth.shipbob.com')) == 'https://api.shipbob.com/2026-01'
    assert _resolve_base_url('not-a-jwt') == DEFAULT_BASE_URL  # malformed -> prod


class _StubSession:
    """Answers every GET with one canned response, standing in for the network."""

    def __init__(self, status, body):
        self.status, self.body = status, body

    def get(self, url, params=None):
        return self

    def raise_for_status(self):
        if self.status >= 400:
            raise requests.HTTPError(self.status)

    def json(self):
        return self.body


def test_shipbob_order_page_raises_instead_of_reporting_itself_empty():
    """The cron loop stops on an empty page and commits its cursor there, so only
    an exhausted query may answer with one."""
    api = ShipBobAPI(make_pandium(secrets={'shipbob_access_token': _token('https://auth.shipbob.com')}))
    start = datetime(2026, 7, 1)

    api._session = _StubSession(200, [])
    assert api.get_new_orders_page(start, 1) == []  # exhausted

    api._session = _StubSession(503, None)
    with pytest.raises(requests.HTTPError):  # a failure, not an empty page
        api.get_new_orders_page(start, 1)

    api._session = _StubSession(200, {'errors': ['nope']})
    with pytest.raises(RuntimeError):  # a 200 that is not a page of orders either
        api.get_new_orders_page(start, 1)


def test_gorgias_oauth_builds_base_url_and_bearer_header():
    api = GorgiasAPI(make_pandium(secrets=GORGIAS_SECRETS))
    assert api.api_url == 'https://acme.gorgias.com/api'
    assert api._session.headers['Authorization'] == 'Bearer gorgias-token-123'
    assert api._session.auth is None  # no basic auth left anywhere



def test_gorgias_customer_key_is_email_or_synthetic():
    api = GorgiasAPI(make_pandium(secrets=GORGIAS_SECRETS))
    assert api.customer_key(make_order(1, 'x', email='jane@example.com')) == 'jane@example.com'
    assert api.customer_key(make_order(1, 'x', email=None)) == 'Buyer 1 Main St NY US'
