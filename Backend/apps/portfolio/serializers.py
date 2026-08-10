from rest_framework import serializers

from .models import (
    Achievement,
    ContactMessage,
    ExperienceEntry,
    Profile,
    Project,
    ProjectImage,
    SkillGroup,
)


class CamelCaseModelSerializer(serializers.ModelSerializer):
    FIELD_MAP = {
        "short_description": "shortDescription",
        "full_description": "fullDescription",
        "biggest_project": "biggestProject",
        "start_date": "startDate",
        "end_date": "endDate",
        "project_type": "projectType",
        "cover_image": "coverImage",
        "cover_thumbnail": "coverThumbnail",
        "gallery_images": "galleryImages",
        "image_type": "imageType",
        "primary_role": "primaryRole",
        "site_logo": "siteLogo",
        "tech_stack": "techStack",
        "social_links": "socialLinks",
        "about_sections": "aboutSections",
        "highlight_label": "highlightLabel",
        "special_label": "specialLabel",
    }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for snake, camel in self.FIELD_MAP.items():
            if snake in data:
                data[camel] = data.pop(snake)
        return data

    def to_internal_value(self, data):
        if hasattr(data, "copy"):
            data = data.copy()
            for snake, camel in self.FIELD_MAP.items():
                if camel in data and snake not in data:
                    data[snake] = data.pop(camel)
        return super().to_internal_value(data)


class ProfileSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Profile
        exclude = ["created_at", "updated_at"]


class ProjectImageSerializer(CamelCaseModelSerializer):
    class Meta:
        model = ProjectImage
        exclude = ["created_at", "updated_at", "order", "project"]


class ProjectSerializer(CamelCaseModelSerializer):
    # Real uploaded gallery images (see ProjectImage). Distinct from the
    # legacy caption-only `images` JSON list, which stays for entries that
    # only ever had a caption and no real file.
    gallery_images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        exclude = ["created_at", "updated_at", "order"]


class ExperienceEntrySerializer(CamelCaseModelSerializer):
    class Meta:
        model = ExperienceEntry
        exclude = ["created_at", "updated_at", "order"]


class SkillGroupSerializer(CamelCaseModelSerializer):
    class Meta:
        model = SkillGroup
        exclude = ["created_at", "updated_at", "order"]


class AchievementSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Achievement
        exclude = ["created_at", "updated_at", "order"]


class ContactMessageSerializer(CamelCaseModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "company",
            "project_type",
            "budget",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
