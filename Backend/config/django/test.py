"""The deployed TEST / staging server. Selected by ``ENVIRONMENT=test``.

A production-shaped environment — Postgres, DEBUG off, real settings — that you can point at
without touching production data. Not the automated test suite: that is ``testing.py``, loaded
only by pytest.

Differs from production.py in one respect on purpose: the HTTPS hardening (SSL redirect, HSTS)
defaults OFF here, because staging is very often reached over plain HTTP or a bare IP and an
HSTS header served once would pin that hostname to HTTPS in every developer's browser for a
year. Turn them on via the env once staging has a certificate.
"""

from config.env import env
from .base import *  # noqa

DEBUG = False

SECRET_KEY = env("SECRET_KEY")

BASE_URL = env.str("DJANGO_BASE_BACKEND_URL", default="")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

# nginx terminates the connection and forwards the original scheme; without this Django would
# think every request arrived over plain HTTP.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Off by default — see the module docstring. Set these to true once staging has TLS.
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=False)
SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS", default=0)

# Cookie flags follow whether TLS is actually available, so a plain-HTTP staging box can still
# log in. On a staging server WITH TLS, set all three to true in the env.
_TLS = env.bool("SECURE_SSL_REDIRECT", default=False)
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=_TLS)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=_TLS)
AUTH_COOKIE_SECURE = env.bool("AUTH_COOKIE_SECURE", default=_TLS)

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

# The real hashers, so staging measures the same login cost production will.
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
