"""
Notifications app admin configuration.
"""

from django.contrib import admin
from .models import Notification, EmailLog, SMSLog, NotificationTemplate


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notification_type', 'is_read', 'is_sent', 'created_at')
    list_filter = ('notification_type', 'is_read', 'is_sent', 'created_at')
    search_fields = ('recipient__email', 'title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ('recipient_email', 'subject', 'status', 'sent_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('recipient_email', 'subject')
    readonly_fields = ('created_at',)


@admin.register(SMSLog)
class SMSLogAdmin(admin.ModelAdmin):
    list_display = ('recipient_phone', 'status', 'sent_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('recipient_phone',)
    readonly_fields = ('created_at',)


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'notification_type', 'is_active', 'created_at')
    list_filter = ('notification_type', 'is_active')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')
