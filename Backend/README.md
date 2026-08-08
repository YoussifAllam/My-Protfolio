# Portfolio Django Backend

Django + Django REST Framework backend for the portfolio website. It stores the portfolio profile,
projects, experience, skill groups, achievements, and contact messages so the React frontend can
read real content from an API instead of hardcoded TypeScript arrays.

---

## What you get

| | |
|---|---|
| **Content** | Profile, projects, experience, skills, achievements, and contact messages. |
| **API** | Public JSON endpoints under `/api/portfolio/`. |
| **Admin** | Django admin for editing portfolio content. |
| **Database** | SQLite locally; PostgreSQL-ready settings for production. |
| **Frontend** | CORS allows local Vite on `http://127.0.0.1:5173`. |

---

## Quick start

```bash
cd Backend

make venv                              # creates Venv/ and installs requirements.txt
cp ENV/.env.example ENV/.env.local     # then set SECRET_KEY inside it
make mi                                # apply migrations (SQLite, no server needed)
Venv/bin/python manage.py seed_portfolio --settings=config.django.local
make superuser                         # create your first admin
make run                               # http://127.0.0.1:8000
```

Generate a secret key with:

```bash
Venv/bin/python -c "from django.core.management.utils import get_random_secret_key as k; print(k())"
```

Run `make` on its own to see every target. All of them take `ENV=local|test|prod`.

```bash
make test        # pytest — in-memory SQLite, no database server required
make lint        # flake8
make check       # Django system checks
```

---

## Portfolio API

```
GET    /api/portfolio/summary/
GET    /api/portfolio/projects/
GET    /api/portfolio/projects/?featured=true
GET    /api/portfolio/projects/?category=Backend
GET    /api/portfolio/projects/<slug>/
GET    /api/portfolio/experience/
GET    /api/portfolio/skills/
GET    /api/portfolio/achievements/
POST   /api/portfolio/contact/
```

Contact body:

```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "company": "Company",
  "projectType": "Django Backend",
  "budget": "Open to discuss",
  "message": "Project details..."
}
```

Example frontend request:

```ts
await fetch("http://127.0.0.1:8000/api/portfolio/contact/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});
```

Set `DJANGO_CORS_ORIGIN_WHITELIST` and `CSRF_TRUSTED_ORIGINS` to your frontend origin in
production.

---

## Layout

```
Backend/
├── apps/
│   └── portfolio/         models, serializers, views, admin, seed command
├── config/
│   ├── django/            base.py + local.py / test.py / production.py
│   ├── settings_modules/  one file per concern (DRF, CORS, database, email ...)
│   ├── env.py             picks ENV/.env.<ENVIRONMENT>
│   └── urls.py
├── ENV/                   .env.example (committed) + your .env.local (never committed)
└── Makefile
```

`config/django/base.py` star-imports every file in `settings_modules/`, then each environment
module overrides what it needs. To add a setting group, drop a file in `settings_modules/` and add
one line to its `__init__.py`.

### Before deploying

- `SECRET_KEY` set from the environment, never committed.
- `ALLOWED_HOSTS` set to real hostnames.
- `DEBUG=False` (the production settings already force this).
- `DJANGO_CORS_ORIGIN_WHITELIST` and `CSRF_TRUSTED_ORIGINS` set to your production frontend origin.
- Run `migrate`, `collectstatic`, and `seed_portfolio` once on the server.
- `DJANGO_ADMINS` set if you want to be emailed about 500s.
