# Shortcuts for the common Django commands.
#
# Every target takes ENV=local|test|prod (default: local). It selects BOTH the settings module
# (config.django.*) and the env file (ENV/.env.*) — config/env.py reads the ENVIRONMENT
# variable to find the latter.

# Rename this per project — only used to find your Docker containers.
PROJECT_NAME ?= myproject

ENV ?= local

# Settings module and ENVIRONMENT value differ for production: config/env.py looks for
# ENV/.env.Production while the settings live in config/django/production.py.
SETTINGS_local      := config.django.local
SETTINGS_test       := config.django.test
SETTINGS_prod       := config.django.production
SETTINGS            := $(SETTINGS_$(ENV))

ENVIRONMENT_local   := local
ENVIRONMENT_test    := test
ENVIRONMENT_prod    := Production
ENVIRONMENT         := $(ENVIRONMENT_$(ENV))

# Prefer the project virtualenv when it exists, so make works without activating it first.
PYTHON := $(shell [ -x Venv/bin/python ] && echo Venv/bin/python || echo python3)

MANAGE = ENVIRONMENT=$(ENVIRONMENT) $(PYTHON) manage.py

.DEFAULT_GOAL := help

.PHONY: help venv run check mi make superuser shell test lint static clean \
        clean-migrations up down down-volumes build restart ps logs sh dsh \
        migrate-once backup

help:
	@echo "Usage: make <target> [ENV=local|test|prod]   (default ENV=local)"
	@echo ""
	@echo "Setup:"
	@echo "  venv             - Create Venv/ and install requirements.txt"
	@echo ""
	@echo "Django:"
	@echo "  run              - Run the development server"
	@echo "  check            - Run Django's system checks"
	@echo "  mi               - Apply database migrations"
	@echo "  make             - Create new migrations"
	@echo "  superuser        - Create a superuser"
	@echo "  shell            - Open the Django shell"
	@echo "  test             - Run the test suite (pytest)"
	@echo "  static           - Collect static files"
	@echo ""
	@echo "Quality:"
	@echo "  lint             - flake8 over apps/ and config/"
	@echo ""
	@echo "Housekeeping:"
	@echo "  clean            - Remove __pycache__ and *.pyc"
	@echo "  clean-migrations - Delete migration files (keeps __init__.py) -- DESTRUCTIVE"
	@echo ""
	@echo "Docker (needs ENV/.env.\$$(ENVIRONMENT) to exist):"
	@echo "  up               - Start the stack in the background"
	@echo "  build            - Rebuild the image and start"
	@echo "  down             - Stop the stack (keeps data)"
	@echo "  down-volumes     - Stop AND DELETE the database and uploads"
	@echo "  restart / ps"
	@echo "  logs             - Follow logs; SERVICE=nginx for one service"
	@echo "  sh               - Shell inside the app container"
	@echo "  dsh CMD=\"...\"    - manage.py inside the container"
	@echo "  migrate-once     - One-off migrate (for scaled deployments)"
	@echo "  backup           - pg_dump into Docker/backups/"
	@echo ""
	@echo "Examples:"
	@echo "  make run                       - Development server, local settings"
	@echo "  make test                      - Test suite (always uses config.django.testing)"
	@echo "  make up ENV=local              - Docker stack on http://localhost:8000"
	@echo "  make dsh ENV=prod CMD=shell    - Django shell in the prod container"

# ── Setup ───────────────────────────────────────────────────────────────────────
venv:
	python3 -m venv Venv
	Venv/bin/pip install --upgrade pip
	Venv/bin/pip install -r requirements.txt
	@echo "Done. Now copy ENV/.env.example to ENV/.env.local and set SECRET_KEY."

# ── Django ──────────────────────────────────────────────────────────────────────
run:
	$(MANAGE) runserver --settings=$(SETTINGS)

check:
	$(MANAGE) check --settings=$(SETTINGS)

mi:
	$(MANAGE) migrate --settings=$(SETTINGS)

make:
	$(MANAGE) makemigrations --settings=$(SETTINGS)

superuser:
	$(MANAGE) createsuperuser --settings=$(SETTINGS)

shell:
	$(MANAGE) shell --settings=$(SETTINGS)

static:
	$(MANAGE) collectstatic --noinput --settings=$(SETTINGS)

# No ENVIRONMENT override: pytest.ini pins the settings module to config.django.test, which
# forces an in-memory SQLite database, so the suite reads .env.local like everything else and
# needs no test-specific credentials.
test:
	$(PYTHON) -m pytest

# ── Quality ─────────────────────────────────────────────────────────────────────
lint:
	$(PYTHON) -m flake8 apps config

# ── Housekeeping ────────────────────────────────────────────────────────────────
clean:
	find . -path ./Venv -prune -o -name "*.pyc" -print -delete
	find . -path ./Venv -prune -o -name "__pycache__" -type d -print -exec rm -rf {} +

# Wipes migration history. Only safe on a project with no deployed database.
clean-migrations:
	find apps -path "*/migrations/*.py" ! -name "__init__.py" -delete
	find apps -path "*/migrations/*.pyc" -delete

# ── Docker ──────────────────────────────────────────────────────────────────────
# --env-file feeds the ${...} placeholders INSIDE the compose file (image tags, Postgres
# credentials, ports). That is a separate mechanism from the same file being mounted into the
# app container, which is how Django reads it — config/env.py opens the file itself, so it has
# to exist in there too. Both are needed; neither replaces the other.
#
# PROJECT_NAME is exported so the compose files can name the project and the images with it.
COMPOSE = PROJECT_NAME=$(PROJECT_NAME) docker compose \
	--env-file ENV/.env.$(ENVIRONMENT) \
	-f Docker/docker-compose.$(ENV).yml

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

# Also stops and DELETES the database and uploads. Named separately from `down` so it can
# never be the thing you typed by accident.
down-volumes:
	$(COMPOSE) down --volumes

build:
	$(COMPOSE) up --build -d

restart:
	$(COMPOSE) restart

ps:
	$(COMPOSE) ps

# By service name rather than container name, so it keeps working when a service scales.
# `make logs ENV=prod SERVICE=nginx` to follow just one.
logs:
	$(COMPOSE) logs -f $(SERVICE)

sh:
	$(COMPOSE) exec app /bin/bash

# manage.py inside the running app container: `make dsh ENV=prod CMD="createsuperuser"`
dsh:
	$(COMPOSE) exec app python manage.py $(CMD)

# For a scaled deployment where the app containers start with RUN_MIGRATIONS=false, because
# concurrent `migrate` against one database races. Runs once, in a throwaway container.
migrate-once:
	$(COMPOSE) run --rm --no-deps app python manage.py migrate --noinput

# Timestamped dump into Docker/backups/ (mounted into the db container in prod).
backup:
	$(COMPOSE) exec db sh -c 'pg_dump -U "$$POSTGRES_USER" "$$POSTGRES_DB"' > Docker/backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Written to Docker/backups/"
