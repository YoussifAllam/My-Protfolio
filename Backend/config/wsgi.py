"""
WSGI config for styleguide_example project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Use the environment-dispatching settings package (picks local/Production/test
# by $ENVIRONMENT), NOT config.django.base directly — base has no SECRET_KEY.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.django")

application = get_wsgi_application()
