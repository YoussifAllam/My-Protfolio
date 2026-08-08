import os
import sys
from pathlib import Path

from config.env import env
from config.paths import get_logs_dir

LOGS_DIR = Path(get_logs_dir())
LOGS_DIR.mkdir(parents=True, exist_ok=True)


def skip_common_errors(record):
    """Skip 400, 404 and invalid HTTP_HOST errors"""
    if hasattr(record, "status_code") and record.status_code in [400, 404]:
        return False
    if hasattr(record, "msg") and isinstance(record.msg, str):
        if "Invalid HTTP_HOST header" in record.msg:
            return False
    return True


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s %(message)s",
            "style": "%",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "filters": {
        "skip_common_errors": {
            "()": "django.utils.log.CallbackFilter",
            "callback": skip_common_errors,
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",  # Changed from FileHandler
            "filename": os.path.join(LOGS_DIR, "django.log"),
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
        "debug_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": os.path.join(LOGS_DIR, "debug.log"),
            "maxBytes": 1024 * 1024 * 5,
            "backupCount": 5,
            "formatter": "verbose",
        },
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "include_html": True,
            "formatter": "verbose",
            "filters": ["skip_common_errors"],
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file", "mail_admins"],
            "level": "ERROR",
            "propagate": False,  # Changed to False to avoid duplicate logs
        },
        "django.request": {
            "handlers": ["file", "mail_admins"],  # Added file handler
            "level": "ERROR",
            "propagate": False,
        },
        "debug": {
            "handlers": ["console", "debug_file"],  # Use debug_file for INFO
            "level": "INFO",
            "propagate": False,
        },
    },
}

DRF_API_LOGGER_METHODS = ["POST", "DELETE", "PUT", "PATCH", "GET"]
# Persisting every API call to the DB is a write bottleneck under load (each
# request becomes an extra INSERT). Only enabled on Linux (the server OS) — the
# packaged Windows/macOS clients never log to the DB. Still gated by
# DRF_API_LOGGER_DATABASE so it can be turned off on the server too.
DRF_API_LOGGER_DATABASE = sys.platform.startswith("linux") and env.bool(
    "DRF_API_LOGGER_DATABASE", default=True
)
DRF_API_LOGGER_STATUS_CODE_RANGE = []
