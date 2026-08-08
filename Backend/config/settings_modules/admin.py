"""Who hears about 500s.

Django mails ADMINS an unhandled-exception traceback when DEBUG is off. Set DJANGO_ADMINS to a
comma-separated list of ``Name <address>`` pairs; leave it unset to send nobody anything.
"""

from config.env import env


def _parse_admins(raw):
    """``"Ops <ops@x.com>, Dev <dev@x.com>"`` -> ``[("Ops", "ops@x.com"), ...]``.

    Entries without the ``Name <address>`` shape are treated as a bare address.
    """
    admins = []
    for entry in raw:
        entry = entry.strip()
        if not entry:
            continue
        if "<" in entry and entry.endswith(">"):
            name, _, address = entry.partition("<")
            admins.append((name.strip(), address[:-1].strip()))
        else:
            admins.append((entry, entry))
    return admins


ADMINS = _parse_admins(env.list("DJANGO_ADMINS", default=[]))
MANAGERS = ADMINS

# The From: address on those error mails.
SERVER_EMAIL = env.str("SERVER_EMAIL", default="root@localhost")
