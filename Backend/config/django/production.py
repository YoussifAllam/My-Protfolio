from config.env import env
from .base import *  # noqa

DEBUG = False

SECRET_KEY = env("SECRET_KEY")

BASE_URL = env("DJANGO_BASE_BACKEND_URL")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])


# Transport-security settings default to the SECURE (HTTPS) values. For a
# bare-IP HTTP deployment, set the *_SECURE / *_SSL_REDIRECT / HSTS envs to
# false/0 so the site works over plain HTTP; turn them back on once TLS is added.
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=True)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
SECURE_CONTENT_TYPE_NOSNIFF = env.bool("SECURE_CONTENT_TYPE_NOSNIFF", default=True)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=True)
SECURE_BROWSER_XSS_FILTER = True  # Mitigates cross-site scripting attacks
X_FRAME_OPTIONS = "DENY"  # Prevent clickjacking
SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS", default=31536000)  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS", default=True
)
SECURE_HSTS_PRELOAD = env.bool("SECURE_HSTS_PRELOAD", default=True)

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS: list[dict[str, int]] = [  # type: ignore
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        "OPTIONS": {
            "user_attributes": ("username", "email", "first_name", "last_name"),
            "max_similarity": 0.7,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
