"""
Billing app serializers.
"""

from rest_framework import serializers
from .models import Invoice, Payment, BillingRecord


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'payment_method', 'payment_status', 'transaction_id', 'payment_date', 'reference_number', 'created_at']
        read_only_fields = ['id', 'created_at']


class InvoiceSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'patient_name', 'doctor_name', 'amount',
            'discount', 'tax', 'total_amount', 'status', 'description',
            'issued_date', 'due_date', 'notes', 'payments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'invoice_number', 'issued_date', 'created_at', 'updated_at']


class InvoiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['appointment', 'patient', 'doctor', 'amount', 'discount', 'tax', 'description', 'due_date', 'notes']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'payment_method', 'transaction_id', 'payment_date', 'reference_number', 'notes']


class BillingRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    
    class Meta:
        model = BillingRecord
        fields = ['id', 'patient_name', 'service_type', 'service_type_display', 'service_description', 'amount', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
