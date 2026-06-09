"""
Patients app views.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Patient, MedicalHistory, LabResult
from .serializers import (
    PatientSerializer, PatientUpdateSerializer, 
    MedicalHistorySerializer, LabResultSerializer
)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return PatientUpdateSerializer
        return PatientSerializer
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current patient profile."""
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = self.get_serializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response(
                {'detail': 'Patient profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        patient_id = self.kwargs.get('patient_id')
        if patient_id:
            return MedicalHistory.objects.filter(patient_id=patient_id)
        return super().get_queryset()


class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        patient_id = self.kwargs.get('patient_id')
        if patient_id:
            return LabResult.objects.filter(patient_id=patient_id)
        return super().get_queryset()
