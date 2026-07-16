import json
import os
from functools import cached_property
from typing import Any


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
            return []

    @cached_property
    def metadata(self) -> Any | None:
        """The tenant metadata persisted by the previous run, parsed as JSON."""
        filename = self._context.get('tenant_metadata_file')
        if not filename:
            return None
        try:
            with open(filename, encoding='utf-8') as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError):
            return None
