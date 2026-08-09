from django.urls import path

from . import views

app_name = "portfolio"

urlpatterns = [
    path("summary/", views.summary, name="summary"),
    path("projects/", views.ProjectListAPIView.as_view(), name="project-list"),
    path(
        "projects/<slug:slug>/",
        views.ProjectDetailAPIView.as_view(),
        name="project-detail",
    ),
    path("experience/", views.ExperienceListAPIView.as_view(), name="experience-list"),
    path("skills/", views.SkillGroupListAPIView.as_view(), name="skill-list"),
    path(
        "achievements/", views.AchievementListAPIView.as_view(), name="achievement-list"
    ),
    path("contact/", views.ContactMessageCreateAPIView.as_view(), name="contact"),
]
