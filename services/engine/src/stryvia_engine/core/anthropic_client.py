"""Central Anthropic client factory.

Every Claude API call STRYVIA makes routes through this module. Keeping a
single construction point lets us add cross-cutting concerns — request
logging, retry policy, prompt-caching defaults, observability hooks — in one
place rather than peppered across feature modules.

Phase 1A wires the configuration plumbing (env var, validator, dependency)
but does not call the API yet. Phase 1B is the first session that imports
:func:`get_anthropic_client` from a request handler.
"""

from __future__ import annotations

from anthropic import AsyncAnthropic

from stryvia_engine.config import Settings
from stryvia_engine.core.exceptions import ConfigurationError


def get_anthropic_client(settings: Settings) -> AsyncAnthropic:
    """Build an :class:`AsyncAnthropic` client from process settings.

    The async client is the right default: every STRYVIA AI call happens
    inside a request handler that is already async, so we avoid blocking
    the event loop on the upstream HTTP round-trip.

    Raises:
        ConfigurationError: ``ANTHROPIC_API_KEY`` is not configured. In
            production this is caught earlier by the model validator on
            :class:`~stryvia_engine.config.Settings`; this guard exists so
            development misconfigurations fail loudly at first use rather
            than producing an opaque 401 from the upstream API.
    """
    api_key = settings.anthropic_api_key
    if not api_key:
        raise ConfigurationError(
            "ANTHROPIC_API_KEY is not set — configure it in services/engine/.env "
            "(get a key from https://console.anthropic.com/)."
        )
    return AsyncAnthropic(api_key=api_key)


__all__ = ["get_anthropic_client"]
