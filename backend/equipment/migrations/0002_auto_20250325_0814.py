# ============================================================================
# File Path: backend/equipment/migrations/0002_auto_20250325_0814.py
# Description: Data migration to convert calibration intervals to new format
# ============================================================================

from django.db import migrations

def convert_calibration_intervals(apps, schema_editor):
    Equipment = apps.get_model('equipment', 'Equipment')
    for equipment in Equipment.objects.all():
        # Convert existing monthly intervals to the new format
        equipment.calibration_interval_type = 'monthly'
        equipment.calibration_interval_value = equipment.calibration_interval_months
        equipment.save()

def reverse_convert_calibration_intervals(apps, schema_editor):
    Equipment = apps.get_model('equipment', 'Equipment')
    for equipment in Equipment.objects.all():
        # Convert back to monthly intervals if needed
        if equipment.calibration_interval_type == 'monthly':
            equipment.calibration_interval_months = equipment.calibration_interval_value
            equipment.save()

class Migration(migrations.Migration):
    dependencies = [
        ('equipment', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            convert_calibration_intervals,
            reverse_convert_calibration_intervals
        ),
    ]
