from django.core.validators import FileExtensionValidator
from django.db import models
from apps.portfolio.utils.images import build_variant, image_field_changed, variant_name


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


def site_logo_path(instance, filename):
    return f"branding/{filename}"


def cv_file_path(instance, filename):
    return f"documents/{filename}"


class Profile(TimestampedModel):
    name = models.CharField(max_length=120)
    primary_role = models.CharField(max_length=160)
    headline = models.CharField(max_length=220)
    summary = models.TextField()
    location = models.CharField(max_length=120)
    email = models.EmailField()
    availability = models.CharField(max_length=180)
    # Was a CharField holding a URL to wherever the CV happened to be hosted.
    # An actual upload is simpler to keep current — no separate hosting to
    # remember — and this is what the "Download CV" button now serves.
    cv_file = models.FileField(
        upload_to=cv_file_path,
        max_length=255,
        null=True,
        blank=True,
        validators=[FileExtensionValidator(["pdf"])],
        help_text="The PDF served by every \"Download CV\" button on the site.",
    )
    tech_stack = models.JSONField(default=list, blank=True)
    metrics = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=list, blank=True)
    about_sections = models.JSONField(default=list, blank=True)

    # The public site's brand mark (top-left of the nav). Optional — the
    # frontend falls back to its built-in "Y" mark SVG when this is unset, so
    # the site never looks broken before a real logo is uploaded here.
    site_logo = models.ImageField(
        upload_to=site_logo_path,
        max_length=255,
        null=True,
        blank=True,
        help_text="Shown in the site navigation. Resized to at most 256×256 "
        "and re-encoded to PNG (crisp edges, transparency preserved) on save.",
    )

    LOGO_SIZE = (256, 256)

    class Meta:
        verbose_name = "profile"
        verbose_name_plural = "profile"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self._process_site_logo()
        super().save(*args, **kwargs)

    def _process_site_logo(self):
        if not image_field_changed(Profile, self.pk, "site_logo", self.site_logo):
            return
        if not self.site_logo:
            return
        original = self.site_logo
        original_name = original.name  # see the comment in Project._process_cover_image
        logo = build_variant(original, max_size=self.LOGO_SIZE, format="PNG")
        self.site_logo.save(variant_name(original_name, "logo", ext="png"), logo, save=False)


def project_cover_path(instance, filename):
    slug = instance.slug or "unsaved"
    return f"projects/{slug}/cover/{filename}"


def project_gallery_path(instance, filename):
    slug = instance.project.slug if instance.project_id else "unsaved"
    return f"projects/{slug}/gallery/{filename}"


class Project(TimestampedModel):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=180)
    subtitle = models.CharField(max_length=255)
    short_description = models.TextField()
    full_description = models.TextField()
    categories = models.JSONField(default=list)
    featured = models.BooleanField(default=False)
    biggest_project = models.BooleanField(default=False)
    confidential = models.BooleanField(default=False)
    # Withheld from the public API (list + detail) until filled in — an
    # incomplete entry ("Add Project Details") is worse to a visitor than not
    # being there at all. Toggle off in admin once the entry is real.
    draft = models.BooleanField(
        default=False,
        help_text="Hidden from the public API while checked. Use for incomplete entries.",
    )
    company = models.CharField(max_length=180, blank=True)
    year = models.CharField(max_length=40, blank=True)
    start_date = models.CharField(max_length=40, blank=True)
    end_date = models.CharField(max_length=40, null=True, blank=True)
    status = models.CharField(max_length=80)
    role = models.CharField(max_length=180)
    project_type = models.CharField(max_length=180)

    # Uploads are re-encoded to WebP and resized on save — see
    # apps/portfolio/utils/images.py. `cover_image` is the detail-page hero
    # size; `cover_thumbnail` is generated automatically for card grids and is
    # not directly editable.
    cover_image = models.ImageField(
        upload_to=project_cover_path,
        max_length=255,
        null=True,
        blank=True,
        help_text="Resized to at most 1600×900 and re-encoded to WebP on save.",
    )
    cover_thumbnail = models.ImageField(
        upload_to=project_cover_path,
        max_length=255,
        null=True,
        blank=True,
        editable=False,
    )

    # Legacy caption-only gallery entries (no real files). Superseded by the
    # ProjectImage relation below for anything with an actual uploaded image;
    # kept so existing seed captions with no file still round-trip.
    images = models.JSONField(default=list, blank=True)

    technologies = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    challenges = models.JSONField(default=list, blank=True)
    metrics = models.JSONField(default=list, blank=True)
    links = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)

    COVER_FULL_SIZE = (1600, 900)
    COVER_FULL_QUALITY = 82
    COVER_THUMB_SIZE = (640, 360)
    COVER_THUMB_QUALITY = 75

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self._process_cover_image()
        super().save(*args, **kwargs)

    def _process_cover_image(self):
        if not image_field_changed(Project, self.pk, "cover_image", self.cover_image):
            return
        if not self.cover_image:
            self.cover_thumbnail = None
            return
        original = self.cover_image
        # Captured as a plain string, not just aliased: `original` is the same
        # FieldFile object as `self.cover_image`, so the first `.save(...,
        # save=False)` below would rename it in place, and a second
        # `variant_name(original.name, ...)` call would then be building off
        # the already-renamed "...-cover.webp" instead of the real original.
        original_name = original.name
        full = build_variant(
            original, max_size=self.COVER_FULL_SIZE, quality=self.COVER_FULL_QUALITY
        )
        thumb = build_variant(
            original, max_size=self.COVER_THUMB_SIZE, quality=self.COVER_THUMB_QUALITY
        )
        self.cover_image.save(variant_name(original_name, "cover"), full, save=False)
        self.cover_thumbnail.save(
            variant_name(original_name, "thumb"), thumb, save=False
        )


class ProjectImage(TimestampedModel):
    """A gallery image with a real uploaded file, distinct from the legacy
    caption-only `Project.images` JSON list."""

    project = models.ForeignKey(
        Project, related_name="gallery_images", on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to=project_gallery_path,
        max_length=255,
        help_text="Resized to at most 1920×1080 and re-encoded to WebP on save.",
    )
    thumbnail = models.ImageField(
        upload_to=project_gallery_path,
        max_length=255,
        null=True,
        blank=True,
        editable=False,
    )
    caption = models.CharField(max_length=255, blank=True)
    image_type = models.CharField(max_length=40, blank=True)
    order = models.PositiveIntegerField(default=0)

    FULL_SIZE = (1920, 1080)
    FULL_QUALITY = 82
    THUMB_SIZE = (480, 270)
    THUMB_QUALITY = 75

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.caption or f"Image #{self.pk or '?'} — {self.project.name}"

    def save(self, *args, **kwargs):
        self._process_image()
        super().save(*args, **kwargs)

    def _process_image(self):
        if not image_field_changed(ProjectImage, self.pk, "image", self.image):
            return
        if not self.image:
            self.thumbnail = None
            return
        original = self.image
        original_name = original.name  # see the comment in Project._process_cover_image
        full = build_variant(
            original, max_size=self.FULL_SIZE, quality=self.FULL_QUALITY
        )
        thumb = build_variant(
            original, max_size=self.THUMB_SIZE, quality=self.THUMB_QUALITY
        )
        self.image.save(variant_name(original_name, "full"), full, save=False)
        self.thumbnail.save(variant_name(original_name, "thumb"), thumb, save=False)


class ExperienceEntry(TimestampedModel):
    company = models.CharField(max_length=180)
    role = models.CharField(max_length=180)
    type = models.CharField(max_length=80)
    location = models.CharField(max_length=120)
    start_date = models.CharField(max_length=80)
    end_date = models.CharField(max_length=80, null=True, blank=True)
    current = models.BooleanField(default=False)
    highlights = models.JSONField(default=list)
    technologies = models.JSONField(default=list, blank=True)
    special = models.BooleanField(default=False)
    special_label = models.CharField(max_length=120, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name_plural = "experience entries"

    def __str__(self):
        return f"{self.role} at {self.company}"


class SkillGroup(TimestampedModel):
    category = models.CharField(max_length=120)
    icon = models.CharField(max_length=80)
    skills = models.JSONField(default=list)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.category


class Achievement(TimestampedModel):
    title = models.CharField(max_length=180)
    description = models.TextField()
    icon = models.CharField(max_length=80)
    highlight = models.CharField(max_length=80)
    highlight_label = models.CharField(max_length=120)
    detail = models.CharField(max_length=220)
    color = models.CharField(max_length=40)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class ContactMessage(TimestampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    company = models.CharField(max_length=180, blank=True)
    project_type = models.CharField(max_length=120, blank=True)
    budget = models.CharField(max_length=120, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"
