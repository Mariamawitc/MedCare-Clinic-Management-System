"""
Patients app views.
"""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import LabResult, MedicalHistory, Patient
from .serializers import (
    LabResultSerializer,
    MedicalHistorySerializer,
    PatientSerializer,
    PatientUpdateSerializer,
)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return Patient.objects.all()
        if user.role == 'patient':
            return Patient.objects.filter(user=user)
        if user.role == 'doctor':
            return Patient.objects.filter(appointments__doctor__user=user).distinct()
        return Patient.objects.none()

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return PatientUpdateSerializer
        return PatientSerializer

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current patient profile."""
        try:
            patient = self.get_queryset().get(user=request.user)
            serializer = self.get_serializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response({'detail': 'Patient profile not found'}, status=status.HTTP_404_NOT_FOUND)


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.kwargs.get('patient_id')
        queryset = MedicalHistory.objects.all()

        if user.is_staff or user.role == 'admin':
            return queryset if patient_id is None else queryset.filter(patient_id=patient_id)
        if user.role == 'patient':
            return queryset.filter(patient__user=user)
        if user.role == 'doctor':
            return queryset.filter(patient__appointments__doctor__user=user).distinct()
        return queryset.none()


class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.kwargs.get('patient_id')
        queryset = LabResult.objects.all()

        if user.is_staff or user.role == 'admin':
            return queryset if patient_id is None else queryset.filter(patient_id=patient_id)
        if user.role == 'patient':
            return queryset.filter(patient__user=user)
        if user.role == 'doctor':
            return queryset.filter(patient__appointments__doctor__user=user).distinct()
        return queryset.none()
