# Shortcuts for the common project commands.
#
# Django targets take ENV=local|test|prod (default: local). It selects BOTH the settings module
# (config.django.*) and the env file (Backend/ENV/.env.*).

PROJECT_NAME ?= myproject

BACKEND_DIR ?= Backend
FRONTEND_DIR ?= front
ENV ?= local

SETTINGS_local      := config.django.local
SETTINGS_test       := config.django.test
SETTINGS_prod       := config.django.production
SETTINGS            := $(SETTINGS_$(ENV))

ENVIRONMENT_local   := local
ENVIRONMENT_test    := test
ENVIRONMENT_prod    := Production
ENVIRONMENT         := $(ENVIRONMENT_$(ENV))

# Prefer the backend virtualenv when it exists, so make works without activating it first.
PYTHON := $(shell [ -x $(BACKEND_DIR)/Venv/bin/python ] && echo Venv/bin/python || echo python3)

MANAGE = cd $(BACKEND_DIR) && ENVIRONMENT=$(ENVIRONMENT) $(PYTHON) manage.py

.DEFAULT_GOAL := help

.PHONY: help venv run seed front front-install front-build check mi make superuser shell test lint static clean \
        clean-migrations up down down-volumes build restart ps logs sh dsh \
        migrate-once backup

help:
	@echo "Usage: make <target> [ENV=local|test|prod]   (default ENV=local)"
	@echo ""
	@echo "Setup:"
	@echo "  venv             - Create Backend/Venv/ and install Backend/requirements.txt"
	@echo ""
	@echo "Django:"
	@echo "  run              - Run the Django development server"
	@echo "  seed             - Seed portfolio content"
	@echo "  check            - Run Django's system checks"
	@echo "  mi               - Apply database migrations"
	@echo "  make             - Create new migrations"
	@echo "  superuser        - Create a superuser"
	@echo "  shell            - Open the Django shell"
	@echo "  test             - Run the test suite (pytest)"
	@echo "  static           - Collect static files"
	@echo ""
	@echo "Frontend:"
	@echo "  front            - Run the React/Vite development server"
	@echo "  front-install    - Install frontend dependencies"
	@echo "  front-build      - Build the frontend for production"
	@echo ""
	@echo "Quality:"
	@echo "  lint             - flake8 over Backend/apps/ and Backend/config/"
	@echo ""
	@echo "Housekeeping:"
	@echo "  clean            - Remove backend __pycache__ and *.pyc"
	@echo "  clean-migrations - Delete backend migration files (keeps __init__.py) -- DESTRUCTIVE"
	@echo ""
	@echo "Examples:"
	@echo "  make run                       - Django server, local settings"
	@echo "  make front                     - Frontend on http://127.0.0.1:5173"
	@echo "  make test                      - Test suite"
	@echo "  make up ENV=local              - Docker stack on http://localhost:8000"
	@echo "  make dsh ENV=prod CMD=shell    - Django shell in the prod container"

# ── Setup ───────────────────────────────────────────────────────────────────────
venv:
	cd $(BACKEND_DIR) && python3 -m venv Venv
	cd $(BACKEND_DIR) && Venv/bin/pip install --upgrade pip
	cd $(BACKEND_DIR) && Venv/bin/pip install -r requirements.txt
	@echo "Done. Now copy Backend/ENV/.env.example to Backend/ENV/.env.local and set SECRET_KEY."

# ── Django ──────────────────────────────────────────────────────────────────────
run:
	$(MANAGE) runserver --settings=$(SETTINGS)

seed:
	$(MANAGE) seed_portfolio --settings=$(SETTINGS)

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

test:
	cd $(BACKEND_DIR) && $(PYTHON) -m pytest

# ── Frontend ────────────────────────────────────────────────────────────────────
front:
	cd $(FRONTEND_DIR) && npm run dev -- --host 127.0.0.1 --port 5173 --strictPort false

front-install:
	cd $(FRONTEND_DIR) && npm install --package-lock=false

front-build:
	cd $(FRONTEND_DIR) && npm run build

# ── Quality ─────────────────────────────────────────────────────────────────────
lint:
	cd $(BACKEND_DIR) && $(PYTHON) -m flake8 apps config

# ── Housekeeping ────────────────────────────────────────────────────────────────
clean:
	find $(BACKEND_DIR) -path $(BACKEND_DIR)/Venv -prune -o -name "*.pyc" -print -delete
	find $(BACKEND_DIR) -path $(BACKEND_DIR)/Venv -prune -o -name "__pycache__" -type d -print -exec rm -rf {} +

clean-migrations:
	find $(BACKEND_DIR)/apps -path "*/migrations/*.py" ! -name "__init__.py" -delete
	find $(BACKEND_DIR)/apps -path "*/migrations/*.pyc" -delete
