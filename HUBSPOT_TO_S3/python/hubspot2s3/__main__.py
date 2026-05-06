import sys
import logging
import csv
import io
import requests
import json

from .lib import Config, Secrets, Context, truthy

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - '
                                               '%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    config = Config.from_env()
    secrets = Secrets.from_env()
    context = Context.from_env()


    print(f'This run is in mode: {context.run_mode}', file=sys.stderr)

    url = "https://api.squarespace.com/1.0/commerce/inventory"

    payload = {}
    headers = {
    'Authorization': f'Bearer {secrets.squarespace_access_token}',
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    print(response.text, file=sys.stderr)

    if context.run_mode == 'webhook':
        print("*********", file=sys.stderr)
        print("webhook run, here are the triggers:", file=sys.stderr)
        print(json.dumps(context.run_triggers), file=sys.stderr)







if __name__ == '__main__':
    main()
