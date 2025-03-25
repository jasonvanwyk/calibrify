# ============================================================================
# File Path: backend/equipment/models.py
# Description: Django models for equipment management
# ============================================================================

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone

class Equipment(models.Model):
    """Equipment model for tracking calibration and maintenance."""
    
    name = models.CharField(max_length=200)
    model_number = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    manufacturer = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    purchase_date = models.DateField()
    last_calibration_date = models.DateTimeField(null=True, blank=True)
    next_calibration_date = models.DateTimeField(null=True, blank=True)
    calibration_interval_type = models.CharField(
        max_length=20,
        choices=[
            ('hourly', 'Hourly'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        default='monthly',
        null=True
    )
    calibration_interval_value = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Number of intervals between calibrations",
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('calibration_due', 'Calibration Due'),
            ('calibration_overdue', 'Calibration Overdue'),
            ('maintenance', 'Maintenance'),
            ('retired', 'Retired'),
        ],
        default='active'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_equipment'
    )

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Equipment'

    def __str__(self):
        return f"{self.name} ({self.serial_number})"

    def calculate_status(self):
        """Calculate the equipment status based on calibration dates."""
        now = timezone.now()
        
        # If equipment is retired, keep it retired
        if self.status == 'retired':
            return 'retired'
            
        # If equipment is in maintenance, keep it in maintenance
        if self.status == 'maintenance':
            return 'maintenance'
            
        # Check calibration status
        if not self.last_calibration_date:
            return 'calibration_overdue'
            
        if not self.next_calibration_date:
            return 'calibration_overdue'
            
        # Calculate warning threshold (7 days before due date)
        warning_threshold = (
            self.next_calibration_date - timezone.timedelta(days=7)
        )
        
        if now > self.next_calibration_date:
            return 'calibration_overdue'
        elif now > warning_threshold:
            return 'calibration_due'
        else:
            return 'active'

    def save(self, *args, **kwargs):
        # Calculate next calibration date if last_calibration_date is provided
        if not self.next_calibration_date and self.last_calibration_date:
            interval_days = 0
            if self.calibration_interval_type == 'hourly':
                interval_days = self.calibration_interval_value / 24
            elif self.calibration_interval_type == 'daily':
                interval_days = self.calibration_interval_value
            elif self.calibration_interval_type == 'weekly':
                interval_days = self.calibration_interval_value * 7
            elif self.calibration_interval_type == 'monthly':
                interval_days = self.calibration_interval_value * 30
            elif self.calibration_interval_type == 'yearly':
                interval_days = self.calibration_interval_value * 365

            self.next_calibration_date = (
                self.last_calibration_date + 
                timezone.timedelta(days=interval_days)
            )
        
        # Calculate status based on current state
        self.status = self.calculate_status()
        
        super().save(*args, **kwargs)

class CalibrationRecord(models.Model):
    """Model for tracking calibration records."""
    
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='calibration_records'
    )
    calibration_date = models.DateField()
    calibrated_by = models.CharField(max_length=200)
    certificate_number = models.CharField(max_length=100)
    certificate_file = models.FileField(
        upload_to='calibration_certificates/',
        null=True,
        blank=True
    )
    calibration_standard = models.CharField(max_length=200)
    measurement_points = models.JSONField()
    results = models.JSONField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_calibrations'
    )

    class Meta:
        ordering = ['-calibration_date']
        verbose_name_plural = 'Calibration Records'

    def __str__(self):
        return f"Calibration {self.certificate_number} - {self.equipment.name}"

class MaintenanceRecord(models.Model):
    """Model for tracking maintenance records."""
    
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='maintenance_records'
    )
    maintenance_date = models.DateField()
    maintenance_type = models.CharField(
        max_length=50,
        choices=[
            ('preventive', 'Preventive'),
            ('corrective', 'Corrective'),
            ('inspection', 'Inspection'),
        ]
    )
    performed_by = models.CharField(max_length=200)
    description = models.TextField()
    parts_replaced = models.TextField(blank=True)
    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_maintenance'
    )

    class Meta:
        ordering = ['-maintenance_date']
        verbose_name_plural = 'Maintenance Records'

    def __str__(self):
        return f"Maintenance {self.maintenance_date} - {self.equipment.name}" 