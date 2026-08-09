"""Database configuration, chosen by ENVIRONMENT.

Local dev runs on SQLite so a fresh clone needs no database server. ``test`` expects
PostgreSQL. ``Production`` defaults to PostgreSQL too, but a deployment can opt into
SQLite instead by setting ``PROD_DATABASE_ENGINE=django.db.backends.sqlite3`` — useful
for a low-traffic site on a small box where running a separate Postgres service isn't
worth the memory. In that case only ``PROD_DATABASE_NAME`` is read (a filesystem path);
the USER/PASSWORD/HOST/PORT fields SQLite doesn't use are not required.
"""

from os.path import join

from config.env import BASE_DIR, ENVIRONMENT, env

# Reused by both Postgres blocks: keep connections open for a minute rather than reconnecting
# per request, and check a pooled connection is still alive before handing it out.
_POSTGRES_TUNING = {
    "CONN_MAX_AGE": 60,
    "CONN_HEALTH_CHECKS": True,
}

_SQLITE_ENGINE = "django.db.backends.sqlite3"


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


def _production_db():
    """Postgres by default; SQLite if PROD_DATABASE_ENGINE opts into it."""
    engine = env.str("PROD_DATABASE_ENGINE", default="django.db.backends.postgresql")
    if engine == _SQLITE_ENGINE:
        return {
            "ENGINE": _SQLITE_ENGINE,
            "NAME": env.str(
                "PROD_DATABASE_NAME", default=join(str(BASE_DIR), "db.sqlite3")
            ),
        }
    return _postgres("PROD")


if ENVIRONMENT == "test":
    DATABASES = {"default": _postgres("test")}

elif ENVIRONMENT == "Production":
    DATABASES = {"default": _production_db()}

else:
    DATABASES = {
        "default": {
            "ENGINE": _SQLITE_ENGINE,
            "NAME": join(str(BASE_DIR), "db.sqlite3"),
        }
    }
