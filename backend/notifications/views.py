"""
Notifications app views.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification, EmailLog, SMSLog, NotificationTemplate
from .serializers import (
    NotificationSerializer, EmailLogSerializer, 
    SMSLogSerializer, NotificationTemplateSerializer
)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications."""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.read_date = datetime.now()
        notification.save()
        return Response(self.get_serializer(notification).data)
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        from datetime import datetime
        notifications = self.get_queryset().filter(is_read=False)
        notifications.update(is_read=True, read_date=datetime.now())
        return Response({'detail': f'{notifications.count()} notifications marked as read'})
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Delete all notifications."""
        notifications = self.get_queryset()
        count = notifications.count()
        notifications.delete()
        return Response({'detail': f'{count} notifications deleted'})


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmailLog.objects.all()
    serializer_class = EmailLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['admin', 'receptionist']:
            return EmailLog.objects.all()
        return EmailLog.objects.none()


class SMSLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SMSLog.objects.all()
    serializer_class = SMSLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['admin', 'receptionist']:
            return SMSLog.objects.all()
        return SMSLog.objects.none()


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return NotificationTemplate.objects.all()
        return NotificationTemplate.objects.filter(is_active=True)
