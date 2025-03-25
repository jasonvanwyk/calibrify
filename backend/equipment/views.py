# ============================================================================
# File Path: backend/equipment/views.py
# Description: DRF views for equipment management
# ============================================================================

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Equipment, CalibrationRecord, MaintenanceRecord
from .serializers import (
    EquipmentSerializer,
    CalibrationRecordSerializer,
    MaintenanceRecordSerializer
)


class EquipmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Equipment model."""
    
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow all access

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)

    @action(detail=False, methods=['get'])
    def due_for_calibration(self, request):
        """Get equipment due for calibration."""
        today = timezone.now().date()
        equipment = self.get_queryset().filter(
            next_calibration_date__lte=today,
            status__in=['active', 'calibration_due']
        )
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue_calibration(self, request):
        """Get equipment with overdue calibration."""
        today = timezone.now().date()
        equipment = self.get_queryset().filter(
            next_calibration_date__lt=today,
            status__in=['active', 'calibration_due']
        )
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)


class CalibrationRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for CalibrationRecord model."""
    
    queryset = CalibrationRecord.objects.all()
    serializer_class = CalibrationRecordSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow all access

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for MaintenanceRecord model."""
    
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow all access

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None) 