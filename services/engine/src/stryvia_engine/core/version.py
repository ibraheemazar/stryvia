"""Single source of truth for the engine's version string.

Mirrors ``[project].version`` in ``pyproject.toml``. Bump both together —
when 1B introduces real release tooling, this module will be generated from
the installed package metadata.
"""

VERSION = "0.0.0"

__all__ = ["VERSION"]
