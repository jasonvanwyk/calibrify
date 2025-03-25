# ============================================================================
# File Path: backend/equipment/serializers.py
# Description: DRF serializers for equipment management
# ============================================================================

from rest_framework import serializers
from .models import Equipment, CalibrationRecord, MaintenanceRecord


class CalibrationRecordSerializer(serializers.ModelSerializer):
    """Serializer for CalibrationRecord model."""
    
    class Meta:
        model = CalibrationRecord
        fields = '__all__'
        read_only_fields = ('created_at', 'created_by')


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for MaintenanceRecord model."""
    
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'
        read_only_fields = ('created_at', 'created_by')


class EquipmentSerializer(serializers.ModelSerializer):
    """Serializer for Equipment model."""
    
    calibration_records = CalibrationRecordSerializer(
        many=True,
        read_only=True
    )
    maintenance_records = MaintenanceRecordSerializer(
        many=True,
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    purchase_date = serializers.DateField(format='%Y-%m-%d')
    last_calibration_date = serializers.DateTimeField(
        format='%Y-%m-%dT%H:%M:%S%z',
        required=False,
        allow_null=True
    )
    next_calibration_date = serializers.DateTimeField(
        format='%Y-%m-%dT%H:%M:%S%z',
        required=False,
        allow_null=True
    )

    class Meta:
        model = Equipment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by') 