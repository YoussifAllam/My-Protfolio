"""Settings shared by every environment.

Environment-specific settings live in ``config/django/{local,test,production}.py``; each imports
this module and then overrides. Feature-specific settings are split into
``config/settings_modules/*`` and pulled in by the star-import at the bottom of this file.

Pick the environment with ``ENVIRONMENT=local manage.py runserver --settings=config.django.local``
— or just ``make run ENV=local``.
"""

import os

from config.env import BASE_DIR, env

# Application definition
DEFAULT_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
]

THIRD_PARTY_APPS = [
    "daphne",
    "drf_api_logger",
    "unfold",
    "unfold.contrib.simple_history",
    "unfold.contrib.filters",
    "rest_framework",
    "rest_framework.authtoken",
    # Required by the logout / account-deletion views, which blacklist the refresh token.
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_ckeditor_5",
    "django_filters",
]

LOCAL_APPS = [
    "apps.portfolio",
]


INSTALLED_APPS = THIRD_PARTY_APPS + DEFAULT_APPS + LOCAL_APPS


BASIC_MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.locale.LocaleMiddleware",
]

MIDDLEWARE = (
    [
        "whitenoise.middleware.WhiteNoiseMiddleware",
    ]
    + BASIC_MIDDLEWARE  # noqa
    + [  # noqa
    ]
)

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = env.str("LANGUAGE_CODE", default="en")

# Add a language here and drop its .po under locale/<code>/LC_MESSAGES/ to translate the API.
# API responses follow the Accept-Language header only — see apps/shared/i18n.py.
LANGUAGES = [
    ("en", "English"),
]

LOCALE_PATHS = [os.path.join(str(BASE_DIR), "locale")]

USE_I18N = True

TIME_ZONE = env.str("TIME_ZONE", default="UTC")
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

# NOTE: keep this a relative join. In Docker BASE_DIR == /code so this stays
# /code/staticfiles; on Windows it resolves under the Backend dir instead of a
# bogus C:\code\staticfiles. (The old "/code/staticfiles/" leading slash made
# os.path.join discard BASE_DIR entirely.)
STATIC_ROOT = os.path.join(str(BASE_DIR), "staticfiles")
STATIC_URL = "/static/"
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media
from config.paths import get_media_root  # noqa: E402

MEDIA_URL = "/media/"
MEDIA_ROOT = get_media_root()


# Sites framework
SITE_ID = 1

# SGI
ASGI_APPLICATION = "config.asgi.application"
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
# WSGI_APPLICATION = "config.wsgi.application"


from ..settings_modules import *  # noqa
