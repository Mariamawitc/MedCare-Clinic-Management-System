"""
Doctors app serializers.
"""

from rest_framework import serializers
from .models import Doctor, DoctorSchedule, DoctorAvailability, DoctorReview


class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = DoctorSchedule
        fields = ['id', 'day_of_week', 'day_display', 'start_time', 'end_time', 'is_active']
        read_only_fields = ['id']


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = ['id', 'date', 'start_time', 'end_time', 'slot_duration', 'is_available', 'created_at']
        read_only_fields = ['id', 'created_at']


class DoctorReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    
    class Meta:
        model = DoctorReview
        fields = ['id', 'rating', 'comment', 'patient_name', 'is_anonymous', 'created_at']
        read_only_fields = ['id', 'created_at']


class DoctorListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'user_name', 'license_number', 'specialization', 'specialization_display',
            'years_of_experience', 'qualification', 'consultation_fee', 'rating', 'is_available'
        ]
        read_only_fields = ['id']


class DoctorDetailSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)
    schedules = DoctorScheduleSerializer(many=True, read_only=True)
    availabilities = DoctorAvailabilitySerializer(many=True, read_only=True)
    reviews = DoctorReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'user_name', 'user_email', 'user_phone', 'license_number',
            'specialization', 'specialization_display', 'bio', 'years_of_experience',
            'qualification', 'hospital_affiliation', 'consultation_fee', 'rating',
            'total_consultations', 'is_available', 'schedules', 'availabilities',
            'reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DoctorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['bio', 'consultation_fee', 'is_available', 'hospital_affiliation']
