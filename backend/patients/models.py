"""
Patients app models for MedCare.
"""

from django.db import models
from django.core.validators import FileExtensionValidator
from users.models import CustomUser


class Patient(models.Model):
    """Patient model extending CustomUser."""
    
    BLOOD_TYPE_CHOICES = (
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    )
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, blank=True)
    allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)
    insurance_provider = models.CharField(max_length=255, blank=True)
    insurance_policy_number = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'
    
    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"


class MedicalHistory(models.Model):
    """Medical history records for patients."""
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_history')
    condition = models.CharField(max_length=255)
    diagnosis_date = models.DateField()
    description = models.TextField(blank=True)
    treatment = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('resolved', 'Resolved'), ('archived', 'Archived')],
        default='active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-diagnosis_date']
        verbose_name = 'Medical History'
        verbose_name_plural = 'Medical Histories'
    
    def __str__(self):
        return f"{self.patient.user.get_full_name()} - {self.condition}"


class LabResult(models.Model):
    """Lab test results for patients."""
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_results')
    test_name = models.CharField(max_length=255)
    test_date = models.DateField()
    result_file = models.FileField(
        upload_to='lab_results/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'png', 'doc', 'docx'])],
        blank=True,
        null=True
    )
    result_description = models.TextField(blank=True)
    reference_range = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('cancelled', 'Cancelled')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-test_date']
        verbose_name = 'Lab Result'
        verbose_name_plural = 'Lab Results'
    
    def __str__(self):
        return f"{self.patient.user.get_full_name()} - {self.test_name}"
