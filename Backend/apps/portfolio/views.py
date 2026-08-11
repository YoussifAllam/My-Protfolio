from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Achievement,
    ContactMessage,
    ExperienceEntry,
    Profile,
    Project,
    SkillGroup,
)
from .serializers import (
    AchievementSerializer,
    ContactMessageSerializer,
    ExperienceEntrySerializer,
    ProfileSerializer,
    ProjectSerializer,
    SkillGroupSerializer,
)


class ProjectListAPIView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        # Draft entries stay in the DB (real work in progress) but never reach
        # a visitor — an incomplete "Add Project Details" card is worse than
        # not being listed at all.
        queryset = Project.objects.filter(draft=False).order_by("order")
        # featured = self.request.query_params.get("featured")
        search = self.request.query_params.get("search")

        # if featured in {"1", "true", "True"}:
        #     queryset = queryset.filter(featured=True)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def list(self, request, *args, **kwargs):
        category = request.query_params.get("category")
        queryset = list(self.get_queryset())
        if category and category != "All":
            queryset = [
                project for project in queryset if category in project.categories
            ]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProjectDetailAPIView(generics.RetrieveAPIView):
    queryset = Project.objects.filter(draft=False)
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class ExperienceListAPIView(generics.ListAPIView):
    queryset = ExperienceEntry.objects.all()
    serializer_class = ExperienceEntrySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class SkillGroupListAPIView(generics.ListAPIView):
    queryset = SkillGroup.objects.all()
    serializer_class = SkillGroupSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class AchievementListAPIView(generics.ListAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([AllowAny])
def summary(request):
    profile = Profile.objects.first()
    published_projects = Project.objects.filter(draft=False)

    categories = ["All"]
    for project in published_projects:
        for category in project.categories:
            if category not in categories:
                categories.append(category)

    # `context={"request": request}` is what lets ImageField serialize as an
    # absolute URL (https://api.example.com/media/...) instead of a bare path
    # — without it, ProjectListAPIView/ProjectDetailAPIView would still work
    # (GenericAPIView supplies request context automatically) but this
    # function-based view has to pass it explicitly.
    ctx = {"request": request}
    data = {
        "profile": ProfileSerializer(profile, context=ctx).data if profile else None,
        "featuredProjects": ProjectSerializer(
            published_projects.filter(featured=True), many=True, context=ctx
        ).data,
        "projectsCount": published_projects.count(),
        "categories": categories,
        "experience": ExperienceEntrySerializer(
            ExperienceEntry.objects.all(), many=True, context=ctx
        ).data,
        "skills": SkillGroupSerializer(
            SkillGroup.objects.all(), many=True, context=ctx
        ).data,
        "achievements": AchievementSerializer(
            Achievement.objects.all(), many=True, context=ctx
        ).data,
    }
    return Response(data, status=status.HTTP_200_OK)
