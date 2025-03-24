# ============================================================================
# File Path: backend/equipment/admin.py
# Description: Django admin configuration for equipment models
# ============================================================================

from django.contrib import admin
from .models import Equipment, CalibrationRecord, MaintenanceRecord


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'model_number', 'serial_number', 'manufacturer',
        'status', 'next_calibration_date'
    )
    list_filter = ('status', 'manufacturer', 'category')
    search_fields = ('name', 'model_number', 'serial_number')
    date_hierarchy = 'next_calibration_date'


@admin.register(CalibrationRecord)
class CalibrationRecordAdmin(admin.ModelAdmin):
    list_display = (
        'equipment', 'calibration_date', 'calibrated_by',
        'certificate_number'
    )
    list_filter = ('calibration_date', 'calibrated_by')
    search_fields = ('equipment__name', 'certificate_number')
    date_hierarchy = 'calibration_date'


@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = (
        'equipment', 'maintenance_date', 'maintenance_type',
        'performed_by'
    )
    list_filter = ('maintenance_type', 'maintenance_date', 'performed_by')
    search_fields = ('equipment__name', 'description')
    date_hierarchy = 'maintenance_date' 