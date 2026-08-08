"""Local development settings. Run with ``make run ENV=local``.

SQLite, DEBUG on, the debug toolbar mounted, and one-time codes printed to the console
instead of sent by SMS.
"""

from config.env import env
from .base import *  # noqa

DEBUG = True

SECRET_KEY = env("SECRET_KEY")

# A list, not the string "*" — Django iterates this value, so a bare string would be read as a
# list of single characters and match nothing.
ALLOWED_HOSTS = ["*"]

# daphne takes over the runserver command with its own ASGI one, which the debug toolbar does
# not hook into. WSGI is enough for local work.
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != "daphne"]  # noqa

INSTALLED_APPS += ["debug_toolbar"]  # noqa
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa
DEBUG_TOOLBAR_CONFIG = {
    # Rather than maintaining INTERNAL_IPS, which misses requests coming from a container.
    "SHOW_TOOLBAR_CALLBACK": lambda request: True,
}

WSGI_APPLICATION = "config.wsgi.application"

# ── Development-only relaxations ────────────────────────────────────────────────
# These belong HERE, not in settings_modules/, and the difference matters. Those modules are
# imported by base.py before this file runs, so a default of `not DEBUG` written there would be
# read from the DEBUG *environment variable* rather than from the DEBUG each environment module
# actually sets — which is how a developer's DEBUG=True in .env.local ends up switching the OTP
# login bypass on in production. Secure defaults live there; the exceptions live here.

# Local dev is plain http, where a Secure cookie is never sent back.
AUTH_COOKIE_SECURE = env.bool("AUTH_COOKIE_SECURE", default=False)
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=False)
CSRF_COOKIE_SECURE = AUTH_COOKIE_SECURE
