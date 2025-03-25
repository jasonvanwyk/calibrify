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
        data = serializer.validated_data
        # Set default status if not provided
        if 'status' not in data:
            data['status'] = 'active'
            
        # Calculate next calibration date if last_calibration_date is provided
        last_calibration = data.get('last_calibration_date')
        next_calibration = data.get('next_calibration_date')
        
        if last_calibration and not next_calibration:
            interval_days = 0
            interval_value = data.get('calibration_interval_value', 1)
            interval_type = data.get('calibration_interval_type')

            if interval_type == 'hourly':
                interval_days = interval_value / 24
            elif interval_type == 'daily':
                interval_days = interval_value
            elif interval_type == 'weekly':
                interval_days = interval_value * 7
            elif interval_type == 'monthly':
                interval_days = interval_value * 30
            elif interval_type == 'yearly':
                interval_days = interval_value * 365

            data['next_calibration_date'] = (
                last_calibration + 
                timezone.timedelta(days=interval_days)
            )
        
        # Ensure calibration interval fields are properly set
        if ('calibration_interval_type' in data and 
            'calibration_interval_value' in data):
            # Convert calibration_interval_value to integer if it's a string
            if isinstance(data['calibration_interval_value'], str):
                data['calibration_interval_value'] = int(
                    data['calibration_interval_value']
                )
        
        serializer.save(
            created_by=(
                self.request.user if self.request.user.is_authenticated 
                else None
            )
        )

    def perform_update(self, serializer):
        data = serializer.validated_data
        # Calculate next calibration date if last_calibration_date is updated
        last_calibration = data.get('last_calibration_date')
        next_calibration = data.get('next_calibration_date')
        
        if last_calibration and not next_calibration:
            interval_days = 0
            interval_value = data.get('calibration_interval_value', 1)
            interval_type = data.get('calibration_interval_type')

            if interval_type == 'hourly':
                interval_days = interval_value / 24
            elif interval_type == 'daily':
                interval_days = interval_value
            elif interval_type == 'weekly':
                interval_days = interval_value * 7
            elif interval_type == 'monthly':
                interval_days = interval_value * 30
            elif interval_type == 'yearly':
                interval_days = interval_value * 365

            data['next_calibration_date'] = (
                last_calibration + 
                timezone.timedelta(days=interval_days)
            )
        
        # Ensure calibration interval fields are properly set
        if ('calibration_interval_type' in data and 
            'calibration_interval_value' in data):
            # Convert calibration_interval_value to integer if it's a string
            if isinstance(data['calibration_interval_value'], str):
                data['calibration_interval_value'] = int(
                    data['calibration_interval_value']
                )
        
        serializer.save()

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
        data = serializer.validated_data
        # Convert calibration_interval_value to integer if it's a string
        if isinstance(data.get('calibration_interval_value'), str):
            data['calibration_interval_value'] = int(
                data['calibration_interval_value']
            )
        
        # Set initial calibration dates based on interval type and value
        now = timezone.now()
        interval_type = data.get('calibration_interval_type')
        interval_value = data.get('calibration_interval_value', 1)
        
        if interval_type == 'hourly':
            next_calibration = now + timezone.timedelta(hours=interval_value)
        elif interval_type == 'daily':
            next_calibration = now + timezone.timedelta(days=interval_value)
        elif interval_type == 'weekly':
            next_calibration = now + timezone.timedelta(weeks=interval_value)
        elif interval_type == 'monthly':
            # Add months (approximate)
            next_calibration = now + timezone.timedelta(
                days=30 * interval_value
            )
        else:  # yearly
            # Add years (approximate)
            next_calibration = now + timezone.timedelta(
                days=365 * interval_value
            )
        
        serializer.save(
            created_by=(
                self.request.user if self.request.user.is_authenticated 
                else None
            ),
            last_calibration_date=now,
            next_calibration_date=next_calibration
        )


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for MaintenanceRecord model."""
    
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow all access

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None) 