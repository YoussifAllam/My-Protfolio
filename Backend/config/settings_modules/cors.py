from config.env import env

CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_ALLOW_ALL = False

BASE_BACKEND_URL = env.str("DJANGO_BASE_BACKEND_URL", default="http://localhost:8000")

_default_origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOWED_ORIGINS = env.list(
    "DJANGO_CORS_ORIGIN_WHITELIST",
    default=_default_origins,
)
# django-cors-headers <= 3.x alias
CORS_ORIGIN_WHITELIST = CORS_ALLOWED_ORIGINS

CSRF_TRUSTED_ORIGINS = env.list(
    "CSRF_TRUSTED_ORIGINS",
    default=_default_origins,
)

CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "Access-Control-Allow-Origin",
    "Content-Disposition",
]
