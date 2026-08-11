from django.contrib import admin, messages
from django.db.models import Max
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.urls import path, reverse
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
    list_editable = ["featured", "confidential", "draft", "order"]
    prepopulated_fields = {"slug": ["name"]}
    search_fields = ["name", "subtitle", "company", "role"]
    readonly_fields = ["cover_preview_large", "bulk_upload_link"]
    inlines = [ProjectImageInline]
    fieldsets = (
        (None, {"fields": ["slug", "name", "subtitle", "draft", "order"]}),
        ("Cover image", {"fields": ["cover_image", "cover_preview_large"]}),
        ("Gallery", {"fields": ["bulk_upload_link"]}),
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

    def bulk_upload_link(self, obj):
        if not obj.pk:
            return "Save the project first, then come back here to bulk-upload gallery images."
        url = reverse("admin:portfolio_project_bulk_upload_images", args=[obj.pk])
        return format_html(
            '<a class="button" href="{}">Bulk upload gallery images ↗</a> '
            '<span style="color:#888;font-size:12px">'
            "Pick several files at once instead of adding gallery rows one by one below."
            "</span>",
            url,
        )

    bulk_upload_link.short_description = "Gallery bulk upload"

    def get_urls(self):
        # Extra admin-only URL for the multi-file upload form below — kept as
        # a plain view (not a ModelAdmin action) since actions operate on
        # already-selected rows, not on file input, and this needs to accept
        # a project id plus a multipart POST.
        custom_urls = [
            path(
                "<int:project_id>/bulk-upload-images/",
                self.admin_site.admin_view(self.bulk_upload_images_view),
                name="portfolio_project_bulk_upload_images",
            ),
        ]
        return custom_urls + super().get_urls()

    def bulk_upload_images_view(self, request, project_id):
        project = get_object_or_404(Project, pk=project_id)

        if request.method == "POST":
            files = request.FILES.getlist("images")
            if not files:
                messages.error(request, "No files were selected.")
            else:
                # New uploads go after whatever's already in the gallery,
                # in the order the files were picked — not 1, 2, 3..., which
                # would collide with (and silently reshuffle) existing rows.
                next_order = (
                    project.gallery_images.aggregate(Max("order"))["order__max"] or 0
                ) + 1
                for offset, uploaded_file in enumerate(files):
                    ProjectImage.objects.create(
                        project=project, image=uploaded_file, order=next_order + offset
                    )
                messages.success(
                    request,
                    f"Uploaded {len(files)} image(s) to '{project.name}'. "
                    "Add captions on the project's edit page if you want them.",
                )
            return redirect(
                reverse("admin:portfolio_project_change", args=[project.pk])
            )

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "project": project,
            "title": f"Bulk upload gallery images — {project.name}",
        }
        return TemplateResponse(
            request, "admin/portfolio/project/bulk_upload_images.html", context
        )


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
