import base64
import json

from helpers import GORGIAS_SECRETS, make_order, make_pandium

from sb2gorgias.gorgias import GorgiasAPI
from sb2gorgias.shipbob import DEFAULT_BASE_URL, _resolve_base_url


def _token(iss):
    payload = base64.urlsafe_b64encode(json.dumps({'iss': iss}).encode()).rstrip(b'=').decode()
    return f'header.{payload}.sig'


def test_shipbob_base_url_resolved_from_token_issuer():
    assert _resolve_base_url(_token('https://authstage.shipbob.com')) == 'https://sandbox-api.shipbob.com/2026-01'
    assert _resolve_base_url(_token('https://auth.shipbob.com')) == 'https://api.shipbob.com/2026-01'
    assert _resolve_base_url('not-a-jwt') == DEFAULT_BASE_URL  # malformed -> prod


def test_gorgias_oauth_builds_base_url_and_bearer_header():
    api = GorgiasAPI(make_pandium(secrets=GORGIAS_SECRETS))
    assert api.api_url == 'https://acme.gorgias.com/api'
    assert api._session.headers['Authorization'] == 'Bearer gorgias-token-123'
    assert api._session.auth is None  # no basic auth left anywhere



def test_gorgias_customer_key_is_email_or_synthetic():
    api = GorgiasAPI(make_pandium(secrets=GORGIAS_SECRETS))
    assert api.customer_key(make_order(1, 'x', email='jane@example.com')) == 'jane@example.com'
    assert api.customer_key(make_order(1, 'x', email=None)) == 'Buyer 1 Main St NY US'
