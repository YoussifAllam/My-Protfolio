"""Database configuration, chosen by ENVIRONMENT.

Local dev runs on SQLite so a fresh clone needs no database server. ``test`` and ``Production``
expect PostgreSQL and read their credentials from the matching env file.
"""

from os.path import join

from config.env import BASE_DIR, ENVIRONMENT, env

# Reused by both Postgres blocks: keep connections open for a minute rather than reconnecting
# per request, and check a pooled connection is still alive before handing it out.
_POSTGRES_TUNING = {
    "CONN_MAX_AGE": 60,
    "CONN_HEALTH_CHECKS": True,
}


def _postgres(prefix):
    """Build a Postgres config from ``<prefix>_DATABASE_*`` environment variables."""
    return {
        "ENGINE": env.str(
            f"{prefix}_DATABASE_ENGINE", default="django.db.backends.postgresql"
        ),
        "NAME": env(f"{prefix}_DATABASE_NAME"),
        "USER": env(f"{prefix}_DATABASE_USER"),
        "PASSWORD": env(f"{prefix}_DATABASE_PASSWORD"),
        "HOST": env(f"{prefix}_DATABASE_HOST"),
        "PORT": env(f"{prefix}_DATABASE_PORT"),
        **_POSTGRES_TUNING,
    }


if ENVIRONMENT == "test":
    DATABASES = {"default": _postgres("test")}

elif ENVIRONMENT == "Production":
    DATABASES = {"default": _postgres("PROD")}

else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": join(str(BASE_DIR), "db.sqlite3"),
        }
    }
