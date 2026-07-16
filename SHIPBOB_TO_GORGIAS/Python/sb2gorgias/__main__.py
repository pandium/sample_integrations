import json
import logging
import random
import sys
from typing import Any

import coloredlogs

from .lib import Pandium

logger = logging.getLogger(__name__)
# Logs go to stderr; stdout is reserved for the JSON metadata Pandium reads back.
coloredlogs.install(level='DEBUG', logger=logger, stream=sys.stderr)


def run(mode: str, pandium: Pandium) -> dict[str, Any]:
    """The business logic of the run varies depending on the run mode."""
    match mode:
        case 'init':
            # Init mode: report which secrets are available and populate tenant metadata
            # with the dynamic config values needed for the customer-facing config form. In
            # the real world, these values would be derived from an api call.
            logger.info('The available secrets are: %s', ', '.join(pandium.secrets))
            return {'dynamic_colors': ['red', 'green', 'purple', 'orange', 'yellow']}

        case 'webhook':
            # Webhook mode: each trigger's payload['file'] names a file holding the raw
            # webhook body; read and log it. This version emits no metadata, but there is no
            # reason not to update metadata from here.
            for trigger in pandium.run_triggers:
                file = trigger.get('payload', {}).get('file')
                if not file:
                    continue
                try:
                    with open(file, encoding='utf-8') as f:
                        logger.info(f.read())
                except OSError as err:
                    logger.error('could not read webhook payload %s: %s', file, err)
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

    run_mode = pandium.run_mode or ''

    logger.info('Hello from a Pandium integration, written in Python!')
    logger.info('This run is in mode:  %s', run_mode)

    std_out = run(run_mode, pandium)
    print(json.dumps(std_out))


if __name__ == '__main__':
    main()
