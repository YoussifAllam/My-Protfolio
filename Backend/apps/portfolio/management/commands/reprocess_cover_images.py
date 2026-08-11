"""One-off fix-up for covers uploaded before build_canvas_variant existed.

Project._process_cover_image only reprocesses cover_image when the field
value actually changes (see image_field_changed), so switching the pipeline
to pad onto a fixed canvas (see utils/images.build_canvas_variant) has no
effect on covers already sitting in storage — this command re-runs every
existing one through the current pipeline directly, bypassing that guard.
Safe to re-run: an already-padded cover is exactly canvas-sized, so passing
it back through build_canvas_variant is a no-op past the initial resize.
"""

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db.models import Model

from apps.portfolio.models import Project
from apps.portfolio.utils.images import build_canvas_variant, variant_name


class Command(BaseCommand):
    help = "Re-pad every existing project's cover image onto the fixed 16:9 canvas."

    def handle(self, *args, **options):
        projects = Project.objects.exclude(cover_image="")
        for project in projects:
            original = project.cover_image
            original.open("rb")
            source = ContentFile(original.read())
            source.name = original.name
            original.close()

            full = build_canvas_variant(
                source, canvas_size=Project.COVER_FULL_SIZE, quality=Project.COVER_FULL_QUALITY
            )
            source.seek(0)
            thumb = build_canvas_variant(
                source, canvas_size=Project.COVER_THUMB_SIZE, quality=Project.COVER_THUMB_QUALITY
            )

            original_name = original.name
            project.cover_image.save(variant_name(original_name, "cover"), full, save=False)
            project.cover_thumbnail.save(
                variant_name(original_name, "thumb"), thumb, save=False
            )
            # Project.save(update_fields=...) still runs the model's own
            # override first (update_fields is just forwarded to super()),
            # which would see cover_image as "changed" and run it through
            # build_canvas_variant a second time — harmless (padding an
            # already-padded canvas is a no-op past the initial resize) but
            # pointless. Call Model.save() directly to skip straight to the
            # plain field write.
            Model.save(project, update_fields=["cover_image", "cover_thumbnail"])
            self.stdout.write(f"Reprocessed cover for '{project.slug}'.")

        self.stdout.write(self.style.SUCCESS(f"Done — {projects.count()} project(s)."))
