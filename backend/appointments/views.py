"""
Appointments app views.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Appointment, AppointmentReschedule, AppointmentCancellation
from .serializers import (
    AppointmentListSerializer, AppointmentDetailSerializer,
    AppointmentCreateSerializer, AppointmentApproveSerializer,
    AppointmentRescheduleCreateSerializer, AppointmentRescheduleSerializer,
    AppointmentCancellationSerializer
)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AppointmentDetailSerializer
        elif self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['approve', 'reject']:
            return AppointmentApproveSerializer
        return AppointmentListSerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'patient_profile'):
            return Appointment.objects.filter(patient__user=user)
        elif hasattr(user, 'doctor_profile'):
            return Appointment.objects.filter(doctor__user=user)
        elif user.role == 'receptionist':
            return Appointment.objects.all()
        return Appointment.objects.none()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a pending appointment."""
        appointment = self.get_object()
        if appointment.status != 'pending':
            return Response(
                {'detail': 'Can only approve pending appointments'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.get_serializer(appointment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        appointment.status = 'approved'
        appointment.save()
        return Response(AppointmentDetailSerializer(appointment).data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a pending appointment."""
        appointment = self.get_object()
        if appointment.status != 'pending':
            return Response(
                {'detail': 'Can only reject pending appointments'},
                status=status.HTTP_400_BAD_REQUEST
            )
        appointment.status = 'cancelled'
        appointment.save()
        return Response(AppointmentDetailSerializer(appointment).data)
    
    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule an appointment."""
        appointment = self.get_object()
        serializer = AppointmentRescheduleCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        AppointmentReschedule.objects.create(
            appointment=appointment,
            old_date=appointment.appointment_date,
            old_time=appointment.appointment_time,
            new_date=serializer.validated_data['new_date'],
            new_time=serializer.validated_data['new_time'],
            reason=serializer.validated_data.get('reason', ''),
            requested_by=request.user.email
        )
        
        appointment.appointment_date = serializer.validated_data['new_date']
        appointment.appointment_time = serializer.validated_data['new_time']
        appointment.status = 'rescheduled'
        appointment.save()
        
        return Response(AppointmentDetailSerializer(appointment).data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment."""
        appointment = self.get_object()
        
        AppointmentCancellation.objects.create(
            appointment=appointment,
            reason=request.data.get('reason', 'other'),
            notes=request.data.get('notes', ''),
            cancelled_by=request.user.email
        )
        
        appointment.status = 'cancelled'
        appointment.save()
        
        return Response(AppointmentDetailSerializer(appointment).data)
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark appointment as completed."""
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        return Response(AppointmentDetailSerializer(appointment).data)
