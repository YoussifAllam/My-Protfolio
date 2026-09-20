import json
from pathlib import Path

from django.db.models import Max
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    parser_classes,
    permission_classes,
)
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import (
    Achievement,
    ContactMessage,
    ExperienceEntry,
    Profile,
    Project,
    ProjectImage,
    SkillGroup,
)
from .serializers import (
    AchievementSerializer,
    ContactMessageSerializer,
    ExperienceEntrySerializer,
    ProfileSerializer,
    ProjectSerializer,
    ProjectWriteSerializer,
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


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser])
def upsert_project(request):
    """Create or update a project, with its images, in one multipart POST.

    Form fields:
      payload  JSON object of project fields (camelCase or snake_case), plus
               two optional keys consumed here rather than stored:
               `captions` {filename: caption} and `replaceImages` (bool).
      images   Zero or more files. The one whose name is `cover.<ext>` becomes
               the cover; the rest become gallery entries, ordered by filename
               (so `01-...`, `02-...` land in order no matter what order the
               HTTP client happened to send them in).

    Matching is by `slug`: posting the same slug again updates that project
    and appends any new gallery images, unless `replaceImages` is set.
    """
    try:
        payload = json.loads(request.data.get("payload", ""))
    except json.JSONDecodeError:
        return Response(
            {"payload": "Required: a JSON object as a string."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    captions = payload.pop("captions", {})
    replace_images = payload.pop("replaceImages", False)

    project = Project.objects.filter(slug=payload.get("slug")).first()
    serializer = ProjectWriteSerializer(project, data=payload)
    serializer.is_valid(raise_exception=True)
    created = project is None
    project = serializer.save()

    uploads = sorted(request.FILES.getlist("images"), key=lambda f: f.name)
    cover = next((f for f in uploads if Path(f.name).stem == "cover"), None)
    if cover:
        project.cover_image = cover
        project.save()  # runs the resize/pad/WebP pipeline in Project.save()

    if replace_images:
        project.gallery_images.all().delete()
    next_order = (
        project.gallery_images.aggregate(Max("order"))["order__max"] or 0
    ) + 1
    for offset, uploaded in enumerate(f for f in uploads if f is not cover):
        ProjectImage.objects.create(
            project=project,
            image=uploaded,
            caption=captions.get(uploaded.name, ""),
            order=next_order + offset,
        )

    return Response(
        ProjectSerializer(project, context={"request": request}).data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


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
