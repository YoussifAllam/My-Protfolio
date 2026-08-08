from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Profile(TimestampedModel):
    name = models.CharField(max_length=120)
    primary_role = models.CharField(max_length=160)
    headline = models.CharField(max_length=220)
    summary = models.TextField()
    location = models.CharField(max_length=120)
    email = models.EmailField()
    availability = models.CharField(max_length=180)
    cv_url = models.CharField(max_length=255, blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    metrics = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=list, blank=True)
    about_sections = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "profile"
        verbose_name_plural = "profile"

    def __str__(self):
        return self.name


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
    company = models.CharField(max_length=180, blank=True)
    year = models.CharField(max_length=40, blank=True)
    start_date = models.CharField(max_length=40, blank=True)
    end_date = models.CharField(max_length=40, null=True, blank=True)
    status = models.CharField(max_length=80)
    role = models.CharField(max_length=180)
    project_type = models.CharField(max_length=180)
    cover_image = models.CharField(max_length=255, null=True, blank=True)
    images = models.JSONField(default=list, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    challenges = models.JSONField(default=list, blank=True)
    metrics = models.JSONField(default=list, blank=True)
    links = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


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
