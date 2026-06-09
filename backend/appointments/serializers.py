"""
Appointments app serializers.
"""

from rest_framework import serializers
from .models import Appointment, AppointmentReschedule, AppointmentCancellation


class AppointmentRescheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentReschedule
        fields = ['id', 'old_date', 'old_time', 'new_date', 'new_time', 'reason', 'requested_by', 'created_at']
        read_only_fields = ['id', 'created_at']


class AppointmentCancellationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentCancellation
        fields = ['id', 'reason', 'notes', 'cancelled_by', 'created_at']
        read_only_fields = ['id', 'created_at']


class AppointmentListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.get_specialization_display', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_name', 'doctor_name', 'doctor_specialization',
            'appointment_date', 'appointment_time', 'appointment_type', 'status',
            'duration_minutes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AppointmentDetailSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.get_specialization_display', read_only=True)
    reschedules = AppointmentRescheduleSerializer(many=True, read_only=True)
    cancellations = AppointmentCancellationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_name', 'doctor_name', 'doctor_specialization',
            'appointment_date', 'appointment_time', 'appointment_type', 'reason',
            'notes', 'status', 'duration_minutes', 'created_by', 'reschedules',
            'cancellations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['doctor', 'appointment_date', 'appointment_time', 'appointment_type', 'reason', 'notes']
    
    def create(self, validated_data):
        validated_data['patient'] = self.context['request'].user.patient_profile
        validated_data['created_by'] = 'patient'
        return super().create(validated_data)


class AppointmentApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status', 'notes']


class AppointmentRescheduleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentReschedule
        fields = ['new_date', 'new_time', 'reason']
