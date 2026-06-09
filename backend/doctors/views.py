"""
Doctors app views.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Doctor, DoctorSchedule, DoctorAvailability, DoctorReview
from .serializers import (
    DoctorListSerializer, DoctorDetailSerializer, DoctorUpdateSerializer,
    DoctorScheduleSerializer, DoctorAvailabilitySerializer, DoctorReviewSerializer
)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    ordering_fields = ['rating', 'years_of_experience']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DoctorDetailSerializer
        elif self.action in ['update', 'partial_update']:
            return DoctorUpdateSerializer
        return DoctorListSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current doctor profile."""
        try:
            doctor = Doctor.objects.get(user=request.user)
            serializer = DoctorDetailSerializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response(
                {'detail': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def add_schedule(self, request, pk=None):
        """Add a schedule for the doctor."""
        doctor = self.get_object()
        serializer = DoctorScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=doctor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def available_slots(self, request, pk=None):
        """Get available appointment slots for a doctor."""
        doctor = self.get_object()
        date = request.query_params.get('date')
        availabilities = DoctorAvailability.objects.filter(doctor=doctor, is_available=True)
        if date:
            availabilities = availabilities.filter(date=date)
        serializer = DoctorAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)


class DoctorScheduleViewSet(viewsets.ModelViewSet):
    queryset = DoctorSchedule.objects.all()
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsAuthenticated]


class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        if doctor_id:
            return DoctorAvailability.objects.filter(doctor_id=doctor_id)
        return super().get_queryset()


class DoctorReviewViewSet(viewsets.ModelViewSet):
    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        if doctor_id:
            return DoctorReview.objects.filter(doctor_id=doctor_id)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user.patient_profile)
