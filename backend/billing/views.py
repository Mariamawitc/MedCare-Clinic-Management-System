"""
Billing app views.
"""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import BillingRecord, Invoice, Payment
from .serializers import (
    BillingRecordSerializer,
    InvoiceCreateSerializer,
    InvoiceSerializer,
    PaymentCreateSerializer,
    PaymentSerializer,
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
        if user.is_staff or user.role == 'admin':
            return Invoice.objects.all()
        if user.role == 'patient':
            return Invoice.objects.filter(patient__user=user)
        if user.role == 'doctor':
            return Invoice.objects.filter(doctor__user=user)
        if user.role == 'receptionist':
            return Invoice.objects.all()
        return Invoice.objects.none()

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        """Add payment to invoice."""
        invoice = self.get_object()
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment = Payment.objects.create(invoice=invoice, **serializer.validated_data)

        total_paid = sum(p.amount for p in invoice.payments.filter(payment_status='completed'))
        if total_paid >= invoice.total_amount:
            invoice.status = 'paid'
        elif total_paid > 0:
            invoice.status = 'partially_paid'
        invoice.save()

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return Payment.objects.all()
        if user.role == 'patient':
            return Payment.objects.filter(invoice__patient__user=user)
        if user.role == 'receptionist':
            return Payment.objects.all()
        if user.role == 'doctor':
            return Payment.objects.filter(invoice__doctor__user=user)
        return Payment.objects.none()


class BillingRecordViewSet(viewsets.ModelViewSet):
    queryset = BillingRecord.objects.all()
    serializer_class = BillingRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return BillingRecord.objects.all()
        if user.role == 'patient':
            return BillingRecord.objects.filter(patient__user=user)
        if user.role == 'receptionist':
            return BillingRecord.objects.all()
        return BillingRecord.objects.none()
