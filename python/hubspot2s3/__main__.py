import sys
import logging
import json

import requests

from .lib import Config, Secrets, Context, truthy

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - '
                                               '%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    config = Config.from_env()
    secrets = Secrets.from_env()
    context = Context.from_env()

    print(config)
    print(secrets)
    print(context)

    print(f'This run is in mode: {context.run_mode}', file=sys.stderr)
    print(config, file=sys.stderr)

    triggers = json.loads(context.run_triggers)

    print(triggers)

    if triggers[0]['source'] == 'webhook':
        with open(triggers[0]['payload']['file']) as f:
            print(f.read())




    logger.info('Sync Finished!')


if __name__ == '__main__':
    main()
