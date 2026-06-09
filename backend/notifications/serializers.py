"""
Notifications app serializers.
"""

from rest_framework import serializers
from .models import Notification, EmailLog, SMSLog, NotificationTemplate


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'is_read', 'is_sent', 'sent_date', 'read_date', 'created_at']
        read_only_fields = ['id', 'is_sent', 'sent_date', 'created_at']


class EmailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailLog
        fields = ['id', 'recipient_email', 'subject', 'status', 'error_message', 'sent_at', 'created_at']
        read_only_fields = ['id', 'created_at']


class SMSLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSLog
        fields = ['id', 'recipient_phone', 'message', 'status', 'error_message', 'sent_at', 'created_at']
        read_only_fields = ['id', 'created_at']


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = ['id', 'name', 'notification_type', 'subject', 'template_text', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
