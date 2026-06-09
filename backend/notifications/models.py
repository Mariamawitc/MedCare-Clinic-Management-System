"""
Notifications app models for MedCare.
"""

from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from users.models import CustomUser


class Notification(models.Model):
    """Notification model for sending alerts to users."""
    
    NOTIFICATION_TYPE_CHOICES = (
        ('appointment_confirmation', 'Appointment Confirmation'),
        ('appointment_reminder', 'Appointment Reminder'),
        ('appointment_cancelled', 'Appointment Cancelled'),
        ('appointment_rescheduled', 'Appointment Rescheduled'),
        ('prescription_ready', 'Prescription Ready'),
        ('lab_result_ready', 'Lab Result Ready'),
        ('payment_reminder', 'Payment Reminder'),
        ('general', 'General'),
    )
    
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    sent_date = models.DateTimeField(null=True, blank=True)
    read_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['is_read']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} - {self.recipient.email}"


class EmailLog(models.Model):
    """Log of all emails sent."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    )
    
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Email Log'
        verbose_name_plural = 'Email Logs'
        indexes = [
            models.Index(fields=['recipient_email', '-created_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Email to {self.recipient_email} - {self.status}"


class SMSLog(models.Model):
    """Log of all SMS messages sent."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    )
    
    recipient_phone = models.CharField(max_length=20)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'SMS Log'
        verbose_name_plural = 'SMS Logs'
    
    def __str__(self):
        return f"SMS to {self.recipient_phone} - {self.status}"


class NotificationTemplate(models.Model):
    """Templates for notifications."""
    
    name = models.CharField(max_length=100, unique=True)
    notification_type = models.CharField(max_length=50)
    subject = models.CharField(max_length=255, blank=True)
    template_text = models.TextField(help_text='Use {{variable}} for placeholders')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
    
    def __str__(self):
        return self.name
