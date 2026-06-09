"""
Doctors app models for MedCare.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import CustomUser


class Doctor(models.Model):
    """Doctor model extending CustomUser."""
    
    SPECIALIZATION_CHOICES = (
        ('cardiology', 'Cardiology'),
        ('dermatology', 'Dermatology'),
        ('neurology', 'Neurology'),
        ('pediatrics', 'Pediatrics'),
        ('orthopedics', 'Orthopedics'),
        ('psychiatry', 'Psychiatry'),
        ('oncology', 'Oncology'),
        ('radiology', 'Radiology'),
        ('general', 'General Practice'),
    )
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile')
    license_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES)
    bio = models.TextField(blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    qualification = models.CharField(max_length=255, blank=True)
    hospital_affiliation = models.CharField(max_length=255, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    rating = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)]
    )
    total_consultations = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.get_specialization_display()}"


class DoctorSchedule(models.Model):
    """Schedule/availability for doctors."""
    
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['day_of_week', 'start_time']
        unique_together = ['doctor', 'day_of_week']
        verbose_name = 'Doctor Schedule'
        verbose_name_plural = 'Doctor Schedules'
    
    def __str__(self):
        return f"{self.doctor.user.first_name} - {self.get_day_of_week_display()}"


class DoctorAvailability(models.Model):
    """Daily availability/time slots for doctors."""
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availabilities')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.IntegerField(default=30, help_text='Duration in minutes')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', 'start_time']
        unique_together = ['doctor', 'date']
        verbose_name = 'Doctor Availability'
        verbose_name_plural = 'Doctor Availabilities'
    
    def __str__(self):
        return f"{self.doctor.user.first_name} - {self.date}"


class DoctorReview(models.Model):
    """Reviews/ratings for doctors by patients."""
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='doctor_reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['doctor', 'patient']
        verbose_name = 'Doctor Review'
        verbose_name_plural = 'Doctor Reviews'
    
    def __str__(self):
        return f"Review of Dr. {self.doctor.user.first_name} by Patient"
