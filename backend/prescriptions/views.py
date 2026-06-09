"""
Prescriptions app views.
"""

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Prescription, PrescriptionItem
from .serializers import PrescriptionSerializer, PrescriptionCreateSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PrescriptionCreateSerializer
        return PrescriptionSerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'patient_profile'):
            return Prescription.objects.filter(patient__user=user)
        elif hasattr(user, 'doctor_profile'):
            return Prescription.objects.filter(prescribed_by__user=user)
        return Prescription.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(prescribed_by=self.request.user.doctor_profile)
