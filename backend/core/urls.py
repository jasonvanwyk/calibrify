# ============================================================================
# File Path: backend/core/urls.py
# Description: Django URLs configuration
# ============================================================================

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import root

urlpatterns = [
    path('', root, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('equipment.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 