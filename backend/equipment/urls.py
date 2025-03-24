# ============================================================================
# File Path: backend/equipment/urls.py
# Description: Django URLs configuration for equipment app
# ============================================================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'equipment', views.EquipmentViewSet)
router.register(r'calibration-records', views.CalibrationRecordViewSet)
router.register(r'maintenance-records', views.MaintenanceRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 