import logging
import sys
from typing import Any

import coloredlogs

from . import cron, webhook
from .lib import Pandium

logger = logging.getLogger(__name__)
# Logs go to stderr; stdout is reserved for the JSON metadata Pandium reads back.
coloredlogs.install(level='DEBUG', logger=logging.getLogger(__package__), stream=sys.stderr)


def run(mode: str | None, pandium: Pandium) -> dict[str, Any]:
    match mode:
        case 'webhook':
            # Webhook mode: ShipBob shipment_delivered deliveries (Pandium debounces
            # them into one run) -> a Gorgias ticket per newly delivered shipment.
            return webhook.run(pandium)

        case _:
            # Normal mode: the scheduled ShipBob orders -> Gorgias customer sync.
            return cron.run(pandium)


def main() -> None:
    pandium = Pandium.from_env()

    logger.info('Syncing ShipBob to Gorgias; this run is in mode: %s', pandium.run_mode)

    metadata = run(pandium.run_mode, pandium)
    pandium.update_metadata(metadata)


if __name__ == '__main__':
    main()
