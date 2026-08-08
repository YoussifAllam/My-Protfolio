"""Filesystem locations the settings need before Django is configured.

Kept out of ``settings_modules`` because ``logger.py`` needs ``get_logs_dir()`` while it is
itself being imported into the settings — a circular import if these lived there.

Both paths are overridable by env so a container can mount them elsewhere (e.g.
``MEDIA_ROOT=/data/media``) without touching code. Relative values resolve under ``BASE_DIR``,
which is the ``Backend/`` directory.
"""

import os

from config.env import BASE_DIR, env


def _under_base_dir(path):
    """Absolute paths pass through; relative ones are anchored to ``BASE_DIR``."""
    return path if os.path.isabs(path) else os.path.join(str(BASE_DIR), path)


def get_media_root():
    """Where uploaded files are written. Defaults to ``Backend/media``."""
    return _under_base_dir(env.str("MEDIA_ROOT", default="media"))


def get_logs_dir():
    """Where the rotating log files are written. Defaults to ``Backend/LOGS``."""
    return _under_base_dir(env.str("LOGS_DIR", default="LOGS"))
