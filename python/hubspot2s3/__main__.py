import sys
import logging
import csv
import io

from .hubspot import HubspotAPI
from .s3 import s3_download

from .lib import Config, Secrets, Context, truthy

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - '
                                               '%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    config = Config.from_env()
    secrets = Secrets.from_env()
    context = Context.from_env()

    print(f'This run is in mode: {context.run_mode}', file=sys.stderr)

    hs_api = HubspotAPI(config, secrets)

    s3_file = s3_download(
        access_key_id=secrets.aws_access_key_id,
        secret_access_key=secrets.aws_secret_access_key,
        bucket_name=config.s3_bucket_name,
        path=config.s3_file_name
    )

    reader = csv.DictReader(io.TextIOWrapper(s3_file, encoding='utf-8'))

    for row in reader:
        if truthy(config.make_contact):
            logger.info(f'Creating Contact: {row}')
            resp = hs_api.create('contacts', data=hub_spot_contact_from_row(row))
            resp.raise_for_status()

        if truthy(config.make_company):
            logger.info(f'Creating Company: {row}')
            resp = hs_api.create('companies', data=hub_spot_company_from_row(row))
            resp.raise_for_status()


def hub_spot_contact_from_row(row):
    return {
        'properties': [
            {
                'property': 'email',
                'value': row['email']
            },
            {
                'property': 'firstname',
                'value': row['first_name']
            },
            {
                'property': 'lastname',
                'value': row['last_name']
            },
            {
                'property': 'company',
                'value': row['company']
            },
            {
                'property': 'city',
                'value': row['city']
            },
            {
                'property': 'state',
                'value': row['state']
            },
            {
                'property': 'country',
                'value': row['country']
            },
            {
                'property': 'zip',
                'value': row['zip']
            }
        ]
    }


def hub_spot_company_from_row(row):
    return {
        'properties': [
            {
                'name': 'name',
                'value': row['company']
            },
            {
                'name': 'description',
                'value': row['desc']
            }
        ]
    }


if __name__ == '__main__':
    main()
