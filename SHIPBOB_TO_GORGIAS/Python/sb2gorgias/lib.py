import json
import logging
import os
from functools import cached_property
from typing import Any

logger = logging.getLogger(__name__)


def _from_env(prefix: str) -> dict[str, str]:
    """Collect environment variables starting with ``prefix``, stripping the prefix and
    lower-casing the remaining key."""
    return {key.removeprefix(prefix).lower(): value for key, value in os.environ.items() if key.startswith(prefix)}


class Pandium:
    """Everything Pandium hands to an integration at runtime.

    ``config`` (``PAN_CFG_*``) and ``secrets`` (``PAN_SEC_*``) hold arbitrary keys defined
    per integration and are exposed as plain mappings. ``context`` (``PAN_CTX_*``) is
    controlled by Pandium, so its values are surfaced through named, typed properties.
    """

    def __init__(self, config: dict[str, str], secrets: dict[str, str], context: dict[str, str]):
        self.config = config
        self.secrets = secrets
        self._context = context

    @classmethod
    def from_env(cls) -> 'Pandium':
        return cls(
            config=_from_env('PAN_CFG_'),
            secrets=_from_env('PAN_SEC_'),
            context=_from_env('PAN_CTX_'),
        )

    @property
    def run_mode(self) -> str | None:
        """The run mode for this invocation (e.g. ``init``, ``webhook``)."""
        return self._context.get('run_mode')

    @property
    def run_triggers(self) -> list[Any]:
        """The triggers that caused this run, parsed from JSON. Relevant for webhook
        invocations, where each trigger's ``payload['file']`` names a file holding the raw
        webhook body."""
        raw = self._context.get('run_triggers')
        if not raw:
            return []
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            logger.error('could not parse run triggers as JSON: %s', raw)
            return []

    def webhook_payloads(self) -> list[str]:
        """The raw webhook bodies for this run, read from the file each trigger's
        ``payload['file']`` names. Relevant for webhook invocations."""
        payloads = []
        for trigger in self.run_triggers:
            file = trigger.get('payload', {}).get('file')
            if not file:
                continue
            try:
                with open(file, encoding='utf-8') as f:
                    payloads.append(f.read())
            except OSError as err:
                logger.error('could not read webhook payload %s: %s', file, err)
        return payloads

    @cached_property
    def metadata(self) -> Any | None:
        """The tenant metadata persisted by the previous run, parsed as JSON."""
        filename = self._context.get('tenant_metadata_file')
        if not filename:
            return None
        try:
            with open(filename, encoding='utf-8') as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError) as err:
            logger.error('could not read tenant metadata from %s: %s', filename, err)
            return None

    def update_metadata(self, metadata: Any) -> None:
        """Merge ``metadata`` into the tenant metadata that the next run reads back. Pandium
        captures stdout and merges it into the stored tenant metadata, so this is the only
        thing that should be written there."""
        logger.info('updating metadata with %s', metadata)
        print(json.dumps(metadata))
