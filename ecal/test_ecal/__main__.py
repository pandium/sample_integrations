import logging
import os
import sys
from pprint import pformat

from .lib import Config, Context, Secrets

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - ' '%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    config = Config.from_env()
    secrets = Secrets.from_env()
    context = Context.from_env()

    #  Pandium integrations can be run in 'init' or 'normal' mode.
    #  When the integration is run on Pandium, Pandium will provide run_mode through context.
    #  During local development run mode is defined in the .env as PAN_CTX_RUN_MODE
    print(f'This run is in mode: {context.run_mode}', file=sys.stderr)

    logger.debug('------------------------CONFIG------------------------')
    logger.debug(config)
    #
    logger.debug('------------------------SECRET------------------------')
    logger.debug(secrets)
    #
    logger.debug('------------------------CONTEXT------------------------')
    logger.debug(context)

    logger.debug('------------------------ENV----------------------------')
    logger.debug(pformat(os.environ))


if __name__ == '__main__':
    main()
