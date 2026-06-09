"""
Notifications app URLs.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, EmailLogViewSet, SMSLogViewSet, NotificationTemplateViewSet

router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')
router.register(r'email-logs', EmailLogViewSet, basename='email-log')
router.register(r'sms-logs', SMSLogViewSet, basename='sms-log')
router.register(r'templates', NotificationTemplateViewSet, basename='notification-template')

urlpatterns = [
    path('', include(router.urls)),
]
