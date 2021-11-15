import logging
import sys
import attr
import requests

logger = logging.getLogger(__name__)


@attr.s(slots=True)
class HubspotAPI:
    config = attr.ib()
    secrets = attr.ib()
    _session = attr.ib()

    @_session.default
    def default_session(self):
        querystring = {}
        headers = {}

        if getattr(self.secrets, 'hubspot_hapikey', False):
            querystring['hapikey'] = self.secrets.hubspot_hapikey
        elif getattr(self.secrets, 'hubspot_oauth_access_token', False):
            headers = {
                "Content-Type": "application/json",
                'Authorization': f'Bearer {self.secrets.hubspot_oauth_access_token}'
            }
        else:
            logger.error("hubspot_hapikey or hubspot_oauth_access_token not found")
            logger.error("Exiting script")
            sys.exit(1)

        s = requests.Session()
        s.params = querystring
        s.headers = headers

        return s

    @staticmethod
    def relative_entity_url(entity, key=None, *args, **kwargs):
        v1 = {'contacts': 'contact'}
        v2 = {'companies': 'companies'}
        v1_update = {'update_contact': 'contact'}
        v2_update = {'update_companies': 'companies'}

        if entity in v1:
            rtn = f'{entity}/v1/{v1[entity]}'
        elif entity in v1_update:
            rtn = f'contacts/v1/contact/vid/{kwargs.get("vid")}'
        elif entity in v2:
            rtn = f'{entity}/v2/{v2[entity]}'
        elif entity in v2_update:
            rtn = f'companies/v2/companies/{kwargs.get("cid")}'
            
        if key is not None:
            rtn += f'/{key}'

        return rtn

    def absolute_url(self, relative):
        return f'https://api.hubapi.com/{relative}'

    def get_fqdn(self, entity, key=None, *args, **kwargs):
        return self.absolute_url(self.relative_entity_url(entity, key, **kwargs))

    def _get(self, url, **kwargs):
        kwargs.setdefault('timeout', (3.05, 60))
        return self._session.get(url, **kwargs)

    def _post(self, url, *args, **kwargs):
        kwargs.setdefault('timeout', (3.05, 60))
        return self._session.post(url, *args, **kwargs)

    def _put(self, url, *args, **kwargs):
        kwargs.setdefault('timeout', (3.05, 60))
        return self._session.put(url, *args, **kwargs)

    def create(self, entity, data):
        data = self._post(self.get_fqdn(entity), json=data)
        return data

    def update(self, entiity, data, *args, **kwargs):
        data = self._post(self.get_fqdn(entiity, **kwargs), json=data)
        return data

    def replace(self, entity, key, data):
        logger.info(f'Attempting to replace a {entity}/{key}')
        data = self._put(self.get_fqdn(entity, key), json=data)
        return data