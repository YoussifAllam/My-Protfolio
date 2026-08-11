"""One-off: merge new skill tags into existing SkillGroup rows by category.

Adds each tag in SKILL_ADDITIONS to the matching SkillGroup.skills list if
it isn't already there — existing tags are left untouched, nothing is
removed, and re-running this command is a no-op past the first run.

Run against whichever database you actually want updated, e.g. on the
server or with a local ENV/.env.Production pointed at the real prod DB:

    python manage.py add_skill_tags
    python manage.py add_skill_tags --dry-run   # preview without saving
"""

from django.core.management.base import BaseCommand

from apps.portfolio.models import SkillGroup

# category -> tags to add (only if not already present)
SKILL_ADDITIONS = {
    "Backend": ["REST APIs"],
    "Security": ["Authentication", "Role-based Permissions"],
    "Caching & Queues": ["WebSockets", "Elasticsearch"],
    "Desktop Development": [
        "Desktop Dashboards",
        "REST API Integration",
        "Background Workers",
        "Linux Applications",
        "Windows Applications",
        "Local System Integrations",
    ],
    "DevOps & CI/CD": ["CI/CD"],
    "Cloud & Infrastructure": ["Load Balancing"],
    "Deep Learning": ["Deep Neural Networks"],
}

# Old combined tag to drop wherever "Linux Applications" / "Windows Applications"
# are being added in its place — see Desktop Development above.
SPLIT_REPLACEMENTS = {
    "Desktop Development": {"Linux / Windows Apps"},
}


class Command(BaseCommand):
    help = "Merge new skill tags into existing SkillGroup rows by category (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would change without saving.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        touched = 0

        for category, new_tags in SKILL_ADDITIONS.items():
            try:
                group = SkillGroup.objects.get(category=category)
            except SkillGroup.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"No SkillGroup with category={category!r} — skipped.")
                )
                continue
            except SkillGroup.MultipleObjectsReturned:
                self.stdout.write(
                    self.style.ERROR(
                        f"Multiple SkillGroup rows with category={category!r} — skipped, "
                        "resolve the duplicate manually."
                    )
                )
                continue

            skills = list(group.skills or [])
            to_drop = SPLIT_REPLACEMENTS.get(category, set())
            before = list(skills)

            skills = [s for s in skills if s not in to_drop]
            for tag in new_tags:
                if tag not in skills:
                    skills.append(tag)

            if skills == before:
                self.stdout.write(f"{category}: already up to date.")
                continue

            touched += 1
            self.stdout.write(f"{category}: {before} -> {skills}")
            if not dry_run:
                group.skills = skills
                group.save(update_fields=["skills"])

        if dry_run:
            self.stdout.write(self.style.WARNING(f"Dry run — {touched} group(s) would change."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Done — {touched} group(s) updated."))
