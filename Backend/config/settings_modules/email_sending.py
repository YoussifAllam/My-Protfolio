"""Outgoing mail.

Everything is optional. With no EMAIL_HOST configured the console backend prints messages to
stdout instead of sending them, so a fresh clone boots and can exercise any mail-sending code
without an SMTP account.
"""

from config.env import env

EMAIL_HOST = env.str("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
EMAIL_USE_SSL = env.bool("EMAIL_USE_SSL", default=False)
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD", default="")

EMAIL_BACKEND = env.str(
    "EMAIL_BACKEND",
    default=(
        "django.core.mail.backends.smtp.EmailBackend"
        if EMAIL_HOST
        else "django.core.mail.backends.console.EmailBackend"
    ),
)

DEFAULT_FROM_EMAIL = env.str(
    "DEFAULT_FROM_EMAIL", default=EMAIL_HOST_USER or "webmaster@localhost"
)
