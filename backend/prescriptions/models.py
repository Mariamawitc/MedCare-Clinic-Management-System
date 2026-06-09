"""
Prescriptions app models for MedCare.
"""

from django.db import models
from appointments.models import Appointment
from patients.models import Patient


class Prescription(models.Model):
    """Prescription model for medications prescribed by doctors."""
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription', null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    prescribed_by = models.ForeignKey('doctors.Doctor', on_delete=models.PROTECT, related_name='prescriptions')
    prescription_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-prescription_date']
        verbose_name = 'Prescription'
        verbose_name_plural = 'Prescriptions'
    
    def __str__(self):
        return f"Prescription for {self.patient.user.get_full_name()} by Dr. {self.prescribed_by.user.first_name}"


class PrescriptionItem(models.Model):
    """Individual medications in a prescription."""
    
    FREQUENCY_CHOICES = (
        ('once_daily', 'Once Daily'),
        ('twice_daily', 'Twice Daily'),
        ('thrice_daily', 'Three Times Daily'),
        ('four_times_daily', 'Four Times Daily'),
        ('as_needed', 'As Needed'),
    )
    
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='items')
    medication_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100, help_text='e.g., 500mg')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    duration = models.CharField(max_length=100, help_text='e.g., 7 days, 2 weeks')
    instructions = models.TextField(blank=True, help_text='e.g., take with food, avoid dairy')
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Prescription Item'
        verbose_name_plural = 'Prescription Items'
    
    def __str__(self):
        return f"{self.medication_name} - {self.dosage}"
