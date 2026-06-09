"""
Billing app admin configuration.
"""

from django.contrib import admin
from .models import Invoice, Payment, BillingRecord


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 1


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'get_patient_name', 'total_amount', 'status', 'issued_date')
    list_filter = ('status', 'issued_date')
    search_fields = ('invoice_number', 'patient__user__email')
    readonly_fields = ('created_at', 'updated_at', 'total_amount')
    inlines = [PaymentInline]
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    get_patient_name.short_description = 'Patient'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'amount', 'payment_method', 'payment_status', 'payment_date')
    list_filter = ('payment_method', 'payment_status', 'payment_date')
    search_fields = ('invoice__invoice_number', 'transaction_id')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(BillingRecord)
class BillingRecordAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'service_type', 'amount', 'status', 'created_at')
    list_filter = ('service_type', 'status', 'created_at')
    search_fields = ('patient__user__email', 'service_description')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    get_patient_name.short_description = 'Patient'
