from django.contrib import admin

from .models import Achievement, ContactMessage, ExperienceEntry, Profile, Project, SkillGroup


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["name", "primary_role", "email", "availability"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "company", "status", "featured", "confidential", "order"]
    list_filter = ["featured", "confidential", "status"]
    prepopulated_fields = {"slug": ["name"]}
    search_fields = ["name", "subtitle", "company", "role"]


@admin.register(ExperienceEntry)
class ExperienceEntryAdmin(admin.ModelAdmin):
    list_display = ["company", "role", "type", "current", "order"]
    list_filter = ["current", "type"]
    search_fields = ["company", "role", "location"]


@admin.register(SkillGroup)
class SkillGroupAdmin(admin.ModelAdmin):
    list_display = ["category", "icon", "order"]
    search_fields = ["category"]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["title", "highlight", "color", "order"]
    search_fields = ["title", "description"]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "company", "project_type", "is_read", "created_at"]
    list_filter = ["is_read", "project_type", "created_at"]
    readonly_fields = ["created_at", "updated_at"]
    search_fields = ["name", "email", "company", "message"]
