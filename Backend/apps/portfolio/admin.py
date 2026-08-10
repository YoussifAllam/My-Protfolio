from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from .models import (
    Achievement,
    ContactMessage,
    ExperienceEntry,
    Profile,
    Project,
    ProjectImage,
    SkillGroup,
)


@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    list_display = ["name", "primary_role", "email", "availability"]
    readonly_fields = ["site_logo_preview", "cv_file_preview"]

    def site_logo_preview(self, obj):
        if not obj.site_logo:
            return "No logo uploaded yet — the site shows its built-in mark instead."
        return format_html(
            '<img src="{}" style="height:48px;border-radius:6px;background:#080D18;padding:4px" />',
            obj.site_logo.url,
        )

    site_logo_preview.short_description = "Current logo"

    def cv_file_preview(self, obj):
        if not obj.cv_file:
            return "No CV uploaded yet — every \"Download CV\" button on the site is a dead link."
        return format_html('<a href="{}" target="_blank">View current CV ↗</a>', obj.cv_file.url)

    cv_file_preview.short_description = "Current CV"


class ProjectImageInline(TabularInline):
    model = ProjectImage
    extra = 1
    fields = ["image", "thumbnail_preview", "caption", "image_type", "order"]
    readonly_fields = ["thumbnail_preview"]

    def thumbnail_preview(self, obj):
        if not obj.pk or not obj.thumbnail:
            return "—"
        return format_html(
            '<img src="{}" style="height:56px;border-radius:4px;object-fit:cover" />',
            obj.thumbnail.url,
        )

    thumbnail_preview.short_description = "Preview"


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = [
        "cover_preview",
        "name",
        "company",
        "status",
        "featured",
        "confidential",
        "draft",
        "order",
    ]
    list_filter = ["featured", "confidential", "draft", "status"]
    prepopulated_fields = {"slug": ["name"]}
    search_fields = ["name", "subtitle", "company", "role"]
    readonly_fields = ["cover_preview_large"]
    inlines = [ProjectImageInline]
    fieldsets = (
        (None, {"fields": ["slug", "name", "subtitle", "draft", "order"]}),
        ("Cover image", {"fields": ["cover_image", "cover_preview_large"]}),
        (
            "Content",
            {
                "fields": [
                    "short_description",
                    "full_description",
                    "categories",
                    "technologies",
                    "features",
                    "responsibilities",
                    "challenges",
                    "metrics",
                    "links",
                    "images",
                ]
            },
        ),
        (
            "Metadata",
            {
                "fields": [
                    "featured",
                    "biggest_project",
                    "confidential",
                    "company",
                    "year",
                    "start_date",
                    "end_date",
                    "status",
                    "role",
                    "project_type",
                ]
            },
        ),
    )

    def cover_preview(self, obj):
        if not obj.cover_thumbnail:
            return "—"
        return format_html(
            '<img src="{}" style="height:40px;border-radius:4px;object-fit:cover" />',
            obj.cover_thumbnail.url,
        )

    cover_preview.short_description = "Cover"

    def cover_preview_large(self, obj):
        if not obj.cover_image:
            return "No cover image uploaded yet."
        return format_html(
            '<img src="{}" style="max-height:220px;border-radius:8px" /><br>'
            '<span style="color:#888;font-size:12px">'
            "Resized to at most 1600×900 and re-encoded to WebP automatically on save."
            "</span>",
            obj.cover_image.url,
        )

    cover_preview_large.short_description = "Current cover"


@admin.register(ExperienceEntry)
class ExperienceEntryAdmin(ModelAdmin):
    list_display = ["company", "role", "type", "current", "order"]
    list_filter = ["current", "type"]
    search_fields = ["company", "role", "location"]


@admin.register(SkillGroup)
class SkillGroupAdmin(ModelAdmin):
    list_display = ["category", "icon", "order"]
    search_fields = ["category"]


@admin.register(Achievement)
class AchievementAdmin(ModelAdmin):
    list_display = ["title", "highlight", "color", "order"]
    search_fields = ["title", "description"]


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ["name", "email", "company", "project_type", "is_read", "created_at"]
    list_filter = ["is_read", "project_type", "created_at"]
    readonly_fields = ["created_at", "updated_at"]
    search_fields = ["name", "email", "company", "message"]
