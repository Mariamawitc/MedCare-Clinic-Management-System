"""
Billing app views.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Invoice, Payment, BillingRecord
from .serializers import (
    InvoiceSerializer, InvoiceCreateSerializer, PaymentSerializer,
    PaymentCreateSerializer, BillingRecordSerializer
)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InvoiceCreateSerializer
        return InvoiceSerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'patient_profile'):
            return Invoice.objects.filter(patient__user=user)
        elif hasattr(user, 'doctor_profile'):
            return Invoice.objects.filter(doctor__user=user)
        elif user.role == 'receptionist':
            return Invoice.objects.all()
        return Invoice.objects.none()
    
    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        """Add payment to invoice."""
        invoice = self.get_object()
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment = Payment.objects.create(invoice=invoice, **serializer.validated_data)
        
        # Update invoice status if fully paid
        total_paid = sum(p.amount for p in invoice.payments.filter(payment_status='completed'))
        if total_paid >= invoice.total_amount:
            invoice.status = 'paid'
        elif total_paid > 0:
            invoice.status = 'partially_paid'
        invoice.save()
        
        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED
        )


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


class BillingRecordViewSet(viewsets.ModelViewSet):
    queryset = BillingRecord.objects.all()
    serializer_class = BillingRecordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'patient_profile'):
            return BillingRecord.objects.filter(patient__user=user)
        elif user.role == 'receptionist':
            return BillingRecord.objects.all()
        return BillingRecord.objects.none()
