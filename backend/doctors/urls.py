"""
Doctors app URLs.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, DoctorScheduleViewSet, DoctorAvailabilityViewSet, DoctorReviewViewSet

router = DefaultRouter()
router.register(r'', DoctorViewSet, basename='doctor')
router.register(r'schedules', DoctorScheduleViewSet, basename='doctor-schedule')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:doctor_id>/availabilities/', DoctorAvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}), name='doctor-availability-list'),
    path('<int:doctor_id>/reviews/', DoctorReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='doctor-review-list'),
]
