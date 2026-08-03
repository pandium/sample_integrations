import logging
import random
import sys
from typing import Any

import coloredlogs

from .lib import Pandium

logger = logging.getLogger(__name__)
# Logs go to stderr; stdout is reserved for the JSON metadata Pandium reads back.
coloredlogs.install(level='DEBUG', logger=logger, stream=sys.stderr)


def run(mode: str | None, pandium: Pandium) -> dict[str, Any]:
    """The business logic of the run varies depending on the run mode."""
    match mode:
        case 'init':
            # Init mode: report which secrets are available and populate tenant metadata
            # with the dynamic config values needed for the customer-facing config form. In
            # the real world, these values would be derived from an api call.
            logger.info('The available secrets are: %s', ', '.join(pandium.secrets))
            return {'dynamic_colors': ['red', 'green', 'purple', 'orange', 'yellow']}

        case 'webhook':
            # Webhook mode: log each trigger's raw webhook body. This version emits no
            # metadata, but there is no reason not to update metadata from here.
            for payload in pandium.webhook_payloads():
                logger.info(payload)
            return {}

        case _:
            # Normal mode: log the config, then log the previous normal run's random number
            # and store a fresh random number as metadata.
            logger.info('Tenant configs: %s', pandium.config)
            new_random_number = random.randrange(1_000_000)
            if pandium.metadata is not None:
                logger.info("last run's random number: %s", pandium.metadata.get('random_number'))
            logger.info('new random number: %s', new_random_number)
            return {'random_number': new_random_number}


def main() -> None:
    pandium = Pandium.from_env()

    logger.info('Hello from a Pandium integration, written in Python!')
    logger.info('This run is in mode:  %s', pandium.run_mode)

    metadata = run(pandium.run_mode, pandium)
    pandium.update_metadata(metadata)


if __name__ == '__main__':
    main()
