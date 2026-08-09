"""Gunicorn config for the portfolio Django backend (WSGI).

Used by the systemd unit:
    gunicorn config.wsgi:application -c deploy/gunicorn.conf.py

Mirrors the sibling pos-backend deployment on the same VPS — same box, same
constraints (1 vCPU / ~1GB RAM, SQLite).
"""

import os

# Nginx proxies to this local address (not exposed publicly). Distinct from
# pos-backend's 8001 so both can run on the box at once.
bind = os.environ.get("GUNICORN_BIND", "127.0.0.1:8002")

# SQLite serializes writes, so many worker processes just increase lock
# contention. Keep the worker count modest; add threads for concurrent reads.
# This box is shared with pos-backend (also 3 workers) — 1GB RAM total, so
# stay conservative rather than mirror a from-scratch sizing formula.
workers = int(os.environ.get("GUNICORN_WORKERS", "2"))
threads = int(os.environ.get("GUNICORN_THREADS", "4"))

timeout = int(os.environ.get("GUNICORN_TIMEOUT", "60"))
graceful_timeout = 30
keepalive = 5
max_requests = 1000  # recycle workers to bound memory growth
max_requests_jitter = 100

# Log to stdout/stderr → journald (view with: journalctl -u portfolio-backend -f)
accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("GUNICORN_LOGLEVEL", "info")
proc_name = "portfolio-backend"
