"""
Patients app URLs.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, MedicalHistoryViewSet, LabResultViewSet

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patient')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:patient_id>/medical-history/', MedicalHistoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='medical-history-list'),
    path('<int:patient_id>/lab-results/', LabResultViewSet.as_view({'get': 'list', 'post': 'create'}), name='lab-results-list'),
]
