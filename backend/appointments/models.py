"""
Appointments app models for MedCare.
"""

from django.db import models
from django.core.exceptions import ValidationError
from patients.models import Patient
from doctors.models import Doctor


class Appointment(models.Model):
    """Appointment model for patient-doctor consultations."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    )
    
    APPOINTMENT_TYPE_CHOICES = (
        ('consultation', 'Consultation'),
        ('follow_up', 'Follow-up'),
        ('checkup', 'Checkup'),
        ('procedure', 'Procedure'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPE_CHOICES, default='consultation')
    reason = models.TextField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    duration_minutes = models.IntegerField(default=30)
    created_by = models.CharField(max_length=50, default='patient')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
    
    def __str__(self):
        return f"Appointment: {self.patient.user.first_name} with Dr. {self.doctor.user.first_name} on {self.appointment_date}"
    
    def clean(self):
        if self.appointment_date and self.appointment_time:
            from datetime import datetime, timedelta
            appointment_end = datetime.combine(
                self.appointment_date,
                self.appointment_time
            ) + timedelta(minutes=self.duration_minutes)
            
            # Check for overlapping appointments
            overlapping = Appointment.objects.filter(
                doctor=self.doctor,
                appointment_date=self.appointment_date,
                status__in=['approved', 'completed']
            ).exclude(pk=self.pk)
            
            for apt in overlapping:
                apt_end = datetime.combine(
                    apt.appointment_date,
                    apt.appointment_time
                ) + timedelta(minutes=apt.duration_minutes)
                
                apt_start = datetime.combine(apt.appointment_date, apt.appointment_time)
                new_start = datetime.combine(self.appointment_date, self.appointment_time)
                
                if new_start < apt_end and appointment_end > apt_start:
                    raise ValidationError('Doctor has another appointment at this time')


class AppointmentReschedule(models.Model):
    """Track appointment rescheduling history."""
    
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='reschedules')
    old_date = models.DateField()
    old_time = models.TimeField()
    new_date = models.DateField()
    new_time = models.TimeField()
    reason = models.TextField(blank=True)
    requested_by = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Appointment Reschedule'
        verbose_name_plural = 'Appointment Reschedules'
    
    def __str__(self):
        return f"Reschedule of {self.appointment} from {self.old_date} to {self.new_date}"


class AppointmentCancellation(models.Model):
    """Track appointment cancellation details."""
    
    CANCELLATION_REASON_CHOICES = (
        ('patient_request', 'Patient Request'),
        ('doctor_request', 'Doctor Request'),
        ('emergency', 'Emergency'),
        ('other', 'Other'),
    )
    
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='cancellations')
    reason = models.CharField(max_length=50, choices=CANCELLATION_REASON_CHOICES)
    notes = models.TextField(blank=True)
    cancelled_by = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Appointment Cancellation'
        verbose_name_plural = 'Appointment Cancellations'
    
    def __str__(self):
        return f"Cancellation of {self.appointment}"
