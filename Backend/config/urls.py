from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

third_party_urls = [
    path("ckeditor5/", include("django_ckeditor_5.urls")),
    path("site_administration/", admin.site.urls),
]

urlpatterns = [
    path("api/portfolio/", include("apps.portfolio.urls")),
] + third_party_urls  # noqa

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
