"""
Patients app serializers.
"""

from rest_framework import serializers
from .models import Patient, MedicalHistory, LabResult


class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = ['id', 'condition', 'diagnosis_date', 'description', 'treatment', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = ['id', 'test_name', 'test_date', 'result_file', 'result_description', 'reference_range', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class PatientSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    medical_history = MedicalHistorySerializer(many=True, read_only=True)
    lab_results = LabResultSerializer(many=True, read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id', 'user_email', 'user_name', 'emergency_contact_name', 
            'emergency_contact_phone', 'blood_type', 'allergies', 
            'chronic_conditions', 'insurance_provider', 'insurance_policy_number',
            'medical_history', 'lab_results', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'emergency_contact_name', 'emergency_contact_phone', 'blood_type',
            'allergies', 'chronic_conditions', 'insurance_provider', 'insurance_policy_number'
        ]
