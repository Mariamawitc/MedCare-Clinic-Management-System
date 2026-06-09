"""
Prescriptions app serializers.
"""

from rest_framework import serializers
from .models import Prescription, PrescriptionItem


class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ['id', 'medication_name', 'dosage', 'frequency', 'duration', 'instructions', 'quantity', 'created_at']
        read_only_fields = ['id', 'created_at']


class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='prescribed_by.user.get_full_name', read_only=True)
    
    class Meta:
        model = Prescription
        fields = ['id', 'patient_name', 'doctor_name', 'prescription_date', 'notes', 'status', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'prescription_date', 'created_at', 'updated_at']


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True)
    
    class Meta:
        model = Prescription
        fields = ['appointment', 'patient', 'notes', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        prescription = Prescription.objects.create(**validated_data)
        
        for item_data in items_data:
            PrescriptionItem.objects.create(prescription=prescription, **item_data)
        
        return prescription
